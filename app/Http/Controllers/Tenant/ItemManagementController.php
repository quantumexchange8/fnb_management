<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Category;
use App\Models\Tenant\ModifierGroup;
use App\Models\Tenant\ModifierGroupItem;
use App\Models\Tenant\ModifierItem;
use App\Models\Tenant\ModifierMealItem;
use App\Models\Tenant\Product;
use App\Models\Tenant\ProductModifierGroup;
use App\Models\Tenant\ProductModifierGroupItem;
use App\Models\Tenant\SetMeal;
use App\Models\Tenant\SetMealGroup;
use App\Models\Tenant\SetMealGroupItem;
use App\Models\Tenant\SetMealItem;
use App\Services\RunningNumberService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ItemManagementController extends Controller
{
    public function categoryList()
    {

        return Inertia::render('Tenant/ItemManagement/CategoryList');
    }

    public function createCategory()
    {

        return Inertia::render('Tenant/ItemManagement/CreateCategory');
    }

    public function productList()
    {
        return Inertia::render('Tenant/ItemManagement/ProductList');
    }

    public function createProduct()
    {
        return Inertia::render('Tenant/ItemManagement/CreateProduct');
    }

    public function modifierGroupList()
    {
        return Inertia::render('Tenant/ItemManagement/ModifierGroupList');
    }

    public function createModifierGroup()
    {
        return Inertia::render('Tenant/ItemManagement/CreateModifierGroup');
    }

    public function createSetMeal()
    {

        return Inertia::render('Tenant/ItemManagement/CreateSetMeal');
    }

    public function manageModifierItem()
    {

        return Inertia::render('Tenant/ItemManagement/ManageModifierItem');
    }

    public function setMealListing()
    {

        return Inertia::render('Tenant/ItemManagement/SetMealListing');
    }

    public function editModifierGroup($id)
    {

        $modifierGroup = ModifierGroup::with([
            'modifier_group_items',
            'modifier_group_items.modifier_items',
            'total_link_meal_item', 
            'total_link_meal_item.product',
        ])->where('modifier_group_id', $id)->first();

        return Inertia::render('Tenant/ItemManagement/EditModifierGroup', [
            'modifierGroup' => $modifierGroup,
        ]);
    }

    public function editProduct($id) 
    {
        $findProd = Product::where('item_code', $id)->with([
            'product_modifier_group.modifier_group.modifier_group_items', // global items
            'product_modifier_group.product_modifier_group_item.modifier_item', // custom product items
        ])->first();

        return Inertia::render('Tenant/ItemManagement/EditProduct', [
            'product' => [
                'id' => $findProd->id,
                'name' => $findProd->name,
                'item_code' => $findProd->item_code,
                'category_id' => $findProd->category_id,
                'description' => $findProd->description,
                'prices' => $findProd->prices,
                'visibility' => $findProd->visibility,
                'status' => $findProd->status,
                'modifier_groups' => $findProd->product_modifier_group->map(function ($group) {
                    // Use product-level override if exists, else fallback to group-level default items
                    $modifierItems = $group->product_modifier_group_item->isNotEmpty()
                        ? $group->product_modifier_group_item
                        : $group->modifier_group->modifier_group_items;

                    return [
                        'id' => $group->modifier_group->id,
                        'modifier_group_id' => $group->id,
                        'status' => $group->status,
                        'modifier_group' => [
                            'id' => $group->modifier_group->id,
                            'group_name' => $group->modifier_group->group_name,
                            'group_type' => $group->modifier_group->group_type,
                            'min_select' => $group->modifier_group->min_select,
                            'max_select' => $group->modifier_group->max_select,
                        ],
                        'modifier_group_items' => $modifierItems->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'modifier_item_id' => $item->modifier_item_id ?? null,
                                'modifier_name' => $item->modifier_name,
                                'modifier_price' => $item->modifier_price,
                                'default' => $item->default,
                                'status' => $item->status,
                                'global_price' => optional($item->modifier_item)->modifier_price ?? null,
                            ];
                        }),
                    ];
                }),
            ],
        ]);
    }

    public function editSetMeal($uid) 
    {

        $setMeals = SetMeal::where('set_code', $uid)->with([
            'set_meal_item',
            'set_meal_item.product',
            'set_meal_group',
            'set_meal_group.set_meal_group_item',
            'set_meal_group.set_meal_group_item.product',
        ])->first();

        if ($setMeals) {
            foreach ($setMeals->set_meal_group as $mealgroup) {
                foreach ($mealgroup->set_meal_group_item as $groupItem) {
                    if ($groupItem->product) {
                        $groupItem->product_image = $groupItem->product->getFirstMediaUrl('product_image');
                    } else {
                        $groupItem->product_image = null;
                    }
                }
            }
        }


        return Inertia::render('Tenant/ItemManagement/EditSetMeal', [
            'setMeals' => $setMeals,
        ]);
    }


    public function getCategories(Request $request)
    {

        $query = Category::where('status', 'active')->with(['product'])->orderBy('order_no');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%$search%");
        }

        if ($request->has('categoryType')) {
            $type = $request->get('categoryType');
            $query->where('type', $type);
        }

        if ($request->has('per_page')) {
            $perPage = $request->get('per_page', 10);
            $categories = $query->paginate($perPage);

            return response()->json([
                'data' => $categories->items(),
                'total' => $categories->total(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]);
        } else {
            $categories = $query->get();

            return response()->json([
                'data' => $categories,
            ]);
        }
    }
    public function getSortCategories()
    {
        $categories = Category::where('status', 'active')->orderBy('order_no')->get();

        return response()->json($categories);
    }

    public function getModifier()
    {

        $modifiers = ModifierGroup::where('status', 'active')->with([
            'modifier_group_items', 
            'modifier_group_items.modifier_items', 
            'total_link_meal_item'
        ])->get();

        return response()->json($modifiers);
    }

    public function getProducts(Request $request)
    {
        
        $query = Product::with('category:id,name');

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(12);

        $products->getCollection()->transform(function ($product) {
            $product->product_image = $product->getFirstMediaUrl('product_image');
            return $product;
        });

        return response()->json($products);
    }

    public function getModifierItem()
    {

        $modifierItems = ModifierItem::where('status', 'active')->get();

        $allModifierItems = ModifierItem::get();

        return response()->json([
            'active' => $modifierItems,
            'all' => $allModifierItems,
        ]);
    }

    public function getModifierGroup(Request $request)
    {
        $perPage = $request->get('per_page', 10); // default 10 if not set

        $query = ModifierGroup::with([
            'modifier_group_items', 
            'modifier_group_items.modifier_items', 
            'total_link_meal_item'
        ]);

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('group_name', 'like', "%$search%");
        }

        $modifierGroups = $query->paginate($perPage);
        
        return response()->json([
            'data' => $modifierGroups->items(), // the paginated items
            'total' => $modifierGroups->total(), // total count
            'current_page' => $modifierGroups->currentPage(),
            'last_page' => $modifierGroups->lastPage(),
        ]);
    }

    public function getMealItem()
    {

        $categories = Category::where('status', 'active')
                ->with(['product' => function ($query) {
                    $query->where('status', 'active'); // optional filter
                }])
                ->orderBy('order_no')
                ->get();

        $categories->each(function ($category) {
            $category->product->each(function ($product) {
                $product->product_image = $product->getFirstMediaUrl('product_image');
            });
        });

        return response()->json($categories);
    }

    public function getSetMeal(Request $request)
    {
        $query = SetMeal::with([
            'set_meal_item',
            'set_meal_item.product',
            'set_meal_group',
            'set_meal_group.set_meal_group_item',
            'set_meal_group.set_meal_group_item.product',
        ]);

        $setMeal = $query->paginate(12);

        $setMeal->getCollection()->transform(function ($meal) {
            $meal->set_image = $meal->getFirstMediaUrl('set_image');
            return $meal;
        });

        return response()->json($setMeal);
    }


    // POST METHOD

    public function storeCategory(Request $request)
    {

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'visibility' => 'required|string',
            'description' => 'nullable|string',
            'category_color' => 'required|string|max:7', // Assuming color is a hex code
        ]);

        $category = Category::create([
            'name' => $request->name,
            'type' => $request->type,
            'visibility' => $request->visibility,
            'color' => $request->category_color,
            'description' => $request->description ?? null,
            'status' => 'active',
        ]);

        return redirect()->back();
    }

    public function updateCategoryVisibility(Request $request)
    {

        $findCategory = Category::find($request->id);

        $findCategory->visibility = $request->visibility;
        $findCategory->save();

        return redirect()->back();
    }

    public function updateCategory(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'visibility' => 'required|string',
            'category_color' => 'required|string|max:7', // Assuming color is a hex code
        ]);

        $findCategory = Category::find($request->id);

        $findCategory->name = $request->name;
        $findCategory->visibility = $request->visibility;
        $findCategory->color = $request->category_color;
        $findCategory->description = $request->description ?? null;
        $findCategory->save();

        return redirect()->back();
    }

    public function updateCategoryOrders(Request $request)
    {

        foreach ($request->category_sorting as $sort) {

            $category = Category::find($sort['id']);

            $category->update([
                'order_no' => $sort['order_no'],
            ]);

        }

        return redirect()->back();
    }

    public function deleteCategory(Request $request)
    {

        $findCategory = Category::find($request->id);

        $findCategory->delete();

        return redirect()->back();
    }

    public function storeProduct(Request $request)
    {

        $request->validate([
            'item_code' => 'required|string|max:255|unique:products',
            'name' => 'required|string|max:255',
            'category_id' => 'required',
            'visibility' => 'required|string|max:255',
            'sale_price' => 'required',
            // 'product_image' => 'required|image|mimes:jpeg,png,jpg|dimensions:max_width=500,max_height=500',
            'description' => 'nullable',
        ], [
            // 'product_image.dimensions' => 'The image must not be larger than 500x500 pixels.',
            // 'product_image.mimes' => 'The image must be a file of type: JPG or PNG.',
        ]);

        $findCategory = Category::find($request->category_id);
        // category latest order_no
        $orderNo = Category::latest()->first();
        $latestOrderNo = $orderNo->order_no;

        if (!$findCategory) {

            foreach ($request->new_category as $category) {
                $findCategory = Category::create([
                    'name' => $category['name'],
                    'visibility' => $category['category_visibility'],
                    'color' => $category['color'],
                    'description' => $category['description'],
                    'status' => 'active',
                    'type' => 'single',
                    'order_no' => $latestOrderNo + 1,
                ]);
            }
        }

        $product = Product::create([
            'name' => $request->name,
            'item_code' => $request->item_code,
            'category_id' => $findCategory->id,
            'prices' => $request->sale_price,
            'visibility' => $request->visibility,
            'description' => $request->description,
            'status' => 'active'
        ]);

        if (!empty($request->modifier_group)) {
            foreach ($request->modifier_group as $group) {
                $prodModifierGroup = ProductModifierGroup::create([
                    'product_id' => $product->id,
                    'modifier_group_id' => $group['id'],
                    'status' => $group['status'],
                ]);

                if (!empty($group['modifier_group_items'])) {
                    foreach ($group['modifier_group_items'] as $groupItem) {
                        ProductModifierGroupItem::create([
                            'product_modifier_group_id' => $prodModifierGroup->id,
                            'modifier_item_id' => $groupItem['modifier_item_id'],
                            'modifier_name' => $groupItem['modifier_name'],
                            'modifier_price' => (float) $groupItem['modifier_price'],
                            'status' => $groupItem['status'],
                        ]);
                    }
                }
            }
        }

        if ($request->hasFile('product_image')) {
            $product->addMedia($request->product_image)->toMediaCollection('product_image');
        }


        return redirect()->back();
    }

    public function updateProductVisibility(Request $request)
    {

        $findProduct = Product::find($request->id);

        $findProduct->visibility = $request->visibility;
        $findProduct->save();

        return redirect()->back();
    }

    public function storeModifierItem(Request $request)
    {

        $request->validate([
            'modifier_name' => 'required|string|max:255|unique:modifier_items',
            'price' => 'required',
        ]);

        $createItem = ModifierItem::create([
            'modifier_name' => $request->modifier_name,
            'price' => $request->price,
        ]);

        return redirect()->back();
    }

    public function storeModifierGroup(Request $request)
    {

        // dd($request->all());

        $request->validate([
            'group_name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'min_value' => 'required',
            'max_value' => 'required',
            'overide' => 'required',
            'modifier_item' => 'required|array|min:1',
            // 'meal_items' => 'required|array|min:1',
            'modifier_item.*.modifier_name' => 'required|string|max:255',
            'modifier_item.*.price' => 'required|numeric', // or use 'required' if price can be non-numeric
        ]);

        $modifierGroup = ModifierGroup::create([
            'modifier_group_id' => RunningNumberService::getID('modifier_group'),
            'group_name' => $request->group_name,
            'display_name' => $request->display_name,
            'group_type' => $request->group_type,
            'min_selection' => $request->min_value,
            'max_selection' => $request->max_value,
            'overide' => $request->overide,
            'status' => 'active',
        ]);

        foreach ($request->modifier_item as $item) {

            $modifierGroupItem = ModifierGroupItem::create([
                'modifier_group_id' => $modifierGroup->id,
                'modifier_item_id' => $item['id'],
                'modifier_name' => $item['modifier_name'],
                'modifier_price' => $item['price'],
                'default' => $item['default'],
                'status' => $item['status'],
                'sort_order' => $item['sort_order'],
            ]);
        }

        if (!empty($request->meal_items)) {
            foreach ($request->meal_items as $item) {
                $prodModifierGroup = ProductModifierGroup::create([
                    'modifier_group_id' => $modifierGroup->id,
                    'product_id' => $item['id'],
                ]);
            }
        }

        return redirect()->back();
    }

    public function updateModifierItemStatus(Request $request)
    {

        $findItem = ModifierItem::find($request->id);

        $findItem->update([
            'status' => $request->status,
        ]);

        return redirect()->back();
    }

    public function updateModifierItem(Request $request)
    {

        $request->validate([
            'modifier_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $findItem = ModifierItem::find($request->id);

        $findItem->update([
            'modifier_name' => $request->modifier_name,
            'price' => $request->price,
        ]);

        return redirect()->back();
    }

    public function deleteModifierItem(Request $request)
    {

        $findItem = ModifierItem::find($request->id);

        $checkItemIsUsing = ModifierGroupItem::where('modifier_item_id', $findItem->id)->first();

        if ($checkItemIsUsing) {

            return redirect()->back()->withErrors(['Errors' => 'Modifier group is in use']);
        }

        $findItem->delete();

        return redirect()->back();
    }

    public function updateModifierGroupStatus(Request $request)
    {

        $findItem = ModifierGroup::find($request->id);

        $findItem->update([
            'status' => $request->status,
        ]);

        return redirect()->back();
    }

    public function updateModifierGroup(Request $request)
    {

        $request->validate([
            'group_name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'min_value' => 'required',
            'max_value' => 'required',
            'overide' => 'required',
            'modifier_item' => 'required|array|min:1',
            'meal_items' => 'required|array|min:1',
            'modifier_item.*.modifier_name' => 'required|string|max:255',
            'modifier_item.*.modifier_price' => 'required|numeric', // or use 'required' if price can be non-numeric
        ]);

        $modifierGroup = ModifierGroup::find($request->id);

        $modifierGroup->update([
            'group_name' => $request->group_name,
            'display_name' => $request->display_name,
            'group_type' => $request->group_type,
            'min_selection' => $request->min_value,
            'max_selection' => $request->max_value,
            'overide' => $request->overide,
            'status' => 'active',
        ]);

        // delete item first
        if (!empty($request->deleted_modifier_item)) {
            foreach ($request->deleted_modifier_item as $modifierItem) {
                $deleteItem = ModifierGroupItem::find($modifierItem);
                $deleteItem->delete();
            }
        }

        // update or create
        foreach ($request->modifier_item as $item) {

            $modifierGroupItem = ModifierGroupItem::find($item['id']);

            if ($modifierGroupItem) {
                $modifierGroupItem->update([
                    'modifier_item_id' => $item['id'],
                    'modifier_name'    => $item['modifier_name'],
                    'modifier_price'   => $item['modifier_price'],
                    'default'          => $item['default'],
                    'status'           => $item['status'],
                    'sort_order'       => $item['sort_order'],
                ]);
            } else {
                ModifierGroupItem::create([
                    'modifier_group_id' => $modifierGroup->id,
                    'modifier_item_id' => $item['id'],
                    'modifier_name' => $item['modifier_name'],
                    'modifier_price' => $item['modifier_price'],
                    'default' => $item['default'],
                    'status' => $item['status'],
                    'sort_order' => $item['sort_order'],
                ]);
            }
        }

        // delete meal item first
        if (!empty($request->deleted_meal_item)) {
            foreach ($request->deleted_meal_item as $item) {
                $deleteItem = ProductModifierGroup::where('modifier_group_id', $modifierGroup->id)->where('product_id', $item)->first();
                $deleteItem->delete();
            }
        }

        // update or create meal item
        foreach ($request->meal_items as $item) {

            $modifierItem = ProductModifierGroup::where('modifier_group_id', $modifierGroup->id)->where('product_id', $item['id'])->first();

            if ($modifierItem) {
                $modifierItem->update([
                    'modifier_group_id' => $modifierGroup->id,
                    'product_id' => $item['id'],
                ]);
            } else {
                ProductModifierGroup::create([
                    'modifier_group_id' => $modifierGroup->id,
                    'product_id' => $item['id'],
                ]);
            }
        }

        return redirect()->back();
    }

    public function deleteModifierGroup(Request $request)
    {

        

        $modifierGroup = ModifierGroup::find($request->id);

        $productModifierGroup = ProductModifierGroup::where('modifier_group_id', $modifierGroup->id)->first();

        if ($productModifierGroup) {

            return response()->json([
                'message' => 'this modifier cannot be delete',
            ], 400);

        } else {
            // $productModifierGroup->delete();

            // $modifierGroupItem = ModifierGroupItem::where('modifier_group_id', $productModifierGroup->id)->get();
            // foreach ($modifierGroupItem as $item) {
            //     $item->delete();
            // }

            // $modifierMealItem = ModifierMealItem::where('modifier_group_id', $productModifierGroup->id)->get();
            // foreach ($modifierMealItem as $mealItem) {
            //     $mealItem->delete();
            // }

            return response()->json([
                'message' => 'modifier deleted',
            ], 200);
        }
        

        return redirect()->back();
    }

    public function updateProduct(Request $request)
    {

        // dd($request->all());

        $request->validate([
            'item_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'item_code')->ignore($request->id),
            ],
            'name' => 'required|string|max:255',
            'category_id' => 'required',
            'visibility' => 'required|string|max:255',
            'sale_price' => 'required',
            // 'product_image' => 'required|image|mimes:jpeg,png,jpg|dimensions:max_width=500,max_height=500',
            'description' => 'nullable',
        ], [
            // 'product_image.dimensions' => 'The image must not be larger than 500x500 pixels.',
            // 'product_image.mimes' => 'The image must be a file of type: JPG or PNG.',
        ]);

        $prod = Product::find($request->id);

        $prod->update([
            'item_code' => $request->item_code,
            'name' => $request->name,
            'category_id' => $request->category_id,
            'prices' => $request->sale_price,
            'visibility' => $request->visibility,
            'description' => $request->description,
        ]);


        // DELETE MODIFIER GROUP FROM PRODUCT FIRSt
        if (!empty($request->deleted_modifier_group)) {
            foreach ($request->deleted_modifier_group as $delete_mgroup) {

                $findProdModifierGrp = ProductModifierGroup::where('modifier_group_id', $delete_mgroup)->where('product_id', $prod->id)->first();

                if ($findProdModifierGrp) {
                    $findProdModifierGrp->delete();
                }
            }
        }

        // ONLY UPDATE EXISTING OR NEW MODIFIER GROUP
        if (!empty($request->modifier_group)) {
            foreach ($request->modifier_group as $mgroup) {

                $modifier_group = ProductModifierGroup::find($mgroup['modifier_group_id']);

                // UPDATE EXISTING MODIFIER GROUP
                if ($modifier_group) {
                    foreach ($mgroup['modifier_group_items'] as $mgItem) {
                        $prodModGrpItem = ProductModifierGroupItem::find($mgItem['id']);
                        $prodModGrpItem->update([
                            'modifier_price' => $mgItem['modifier_price'],
                            'status' => $mgItem['status'],
                        ]);
                    }
                }

                // STORE NEW MODIFIER GROUP
                if (!$modifier_group) {

                    $newModifierGroup = ProductModifierGroup::create([
                        'product_id' => $prod->id,
                        'modifier_group_id' => $mgroup['id'],
                        'status' => $mgroup['status'],
                    ]);

                    foreach ($mgroup['modifier_group_items'] as $mgItem) {
                        $createProdMod = ProductModifierGroupItem::create([
                            'product_modifier_group_id' => $newModifierGroup->id,
                            'modifier_item_id' => $mgItem['modifier_item_id'],
                            'modifier_name' => $mgItem['modifier_name'],
                            'modifier_price' => $mgItem['modifier_price'],
                            'status' => $mgItem['status'],
                        ]);
                    }
                }
            }
        }

        if ($request->removeImage) {
            $prod->clearMediaCollection('product_image');

             if ($request->hasFile('product_image')) {
                $prod->addMedia($request->product_image)->toMediaCollection('product_image');
            }
        }
        

        return redirect()->back();
    }

    public function validateSetMeals(Request $request)
    {
        // dd($request->all());
        $step = $request->input('step');

        if ($step == 1) {
            $request->validate([
                'set_code' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('set_meals', 'set_code')->ignore($request->id),
                ],
                'set_name' => 'required|string',
                'no_of_pax' => 'required|integer|min:1',
                'category_id' => 'required|integer',
            ]);
        }

        if ($step == 2) {
            $request->validate([
                'fixed_item' => 'required|array|min:1',
                'selectable_group' => 'required|array|min:1',
                'price_setting' => 'required',
                'base_price' => 'required',
            ]);
        }

        return response()->json(['message' => 'Validation passed']);
    }

    public function storeSetMeals(Request $request)
    {
        $request->validate([
            'branch' => 'required|array|min:1',
            'available_day' => 'required',
            'available_time' => 'required',
            'specify_day' => 'required_if:available_day,specific-day',
            'specify_start_time' => 'required_if:available_time,specific-time',
            'specify_end_time' => 'required_if:available_time,specific-time',
            'stock_alert' => 'required',
            'low_stock' => 'required_if:stock_alert,enable',
            'category_id' => 'required',
        ]);

        $findCategory = Category::find($request->category_id);

        $orderNo = Category::latest()->first();
        $latestOrderNo = $orderNo->order_no;

        if (!$findCategory) {

            foreach ($request->new_category as $category) {
                $findCategory = Category::create([
                    'name' => $category['name'],
                    'visibility' => $category['category_visibility'],
                    'color' => $category['color'],
                    'description' => $category['description'],
                    'status' => 'active',
                    'type' => 'set',
                    'order_no' => $latestOrderNo + 1,
                ]);
            }
        }

        $setMeal = SetMeal::create([
            'set_name' => $request->set_name,
            'set_code' => $request->set_code,
            'no_of_pax' => $request->no_of_pax,
            'category_id' => $findCategory->id,
            'visibility' => 'display',
            'description' => $request->description ?? null,
            'price_setting' => $request->price_setting,
            'base_price' => $request->base_price,
            'branch_id' => json_encode($request->branch),
            'available_days' => $request->available_day,
            'specific_days' => $request->specify_day,
            'available_time' => $request->available_time,
            'available_from' => Carbon::parse($request->specify_start_time)
                                ->setTimezone('Asia/Kuala_Lumpur')
                                ->format('H:i:s'),
            'available_to' => Carbon::parse($request->specify_end_time)
                                ->setTimezone('Asia/Kuala_Lumpur')
                                ->format('H:i:s'),
            'stock_alert' => $request->stock_alert,
            'low_stock_threshold' => $request->low_stock ?? 0,
            'status' => 'active',
        ]);

        foreach ($request->fixed_item as $fItem) {

            $fixedItem = SetMealItem::create([
                'set_meal_id' => $setMeal->id,
                'product_id' => $fItem['id'],
                'quantity' => $fItem['quantity'],
                'status' => 'active',
            ]);

        }

        foreach ($request->selectable_group as $group) {

            $selectedGroup = SetMealGroup::create([
                'set_meal_id' => $setMeal->id,
                'group_name' => $group['group_name'],
                'group_type' => $group['group_type'],
                'group_selectable_type' => $group['group_selectable_type'],
                'min_select' => $group['group_type'] === 'single-select' ? 1 : $group['min_select'],
                'max_select' => $group['group_type'] === 'single-select' ? 1 : $group['max_select'],
                'sort_order' => $group['sort_order'] ?? 0,
            ]);

            foreach ($group['group_option'] as $opt) {

                $groupItem = SetMealGroupItem::create([
                    'set_meal_group_id' => $selectedGroup->id,
                    'product_id' => $opt['id'],
                    'original_price' => $opt['prices'],
                    'additional_charge' => $opt['additional_charge'],
                    'quantity' => $opt['quantity'],
                ]);
            }
        }

        if ($request->hasFile('set_image')) {
            $setMeal->addMedia($request->set_image)->toMediaCollection('set_image');
        }

        return redirect()->back();
    }

    public function updateMealVisibility(Request $request)
    {

        $findSetMeal = SetMeal::find($request->id);

        $findSetMeal->visibility = $request->visibility;
        $findSetMeal->save();

        return redirect()->back();
    }

    public function updateSetMeals(Request $request)
    {

        $request->validate([
            'branch' => 'required|array|min:1',
            'available_day' => 'required',
            'available_time' => 'required',
            'specify_day' => 'required_if:available_day,specific-day',
            'specify_start_time' => 'required_if:available_time,specific-time',
            'specify_end_time' => 'required_if:available_time,specific-time',
            'stock_alert' => 'required',
            'low_stock' => 'required_if:stock_alert,enable',
        ]);

        $setMeal = SetMeal::find($request->id);

        $setMeal->update([
            'set_name' => $request->set_name,
            'set_code' => $request->set_code,
            'no_of_pax' => $request->no_of_pax,
            'category_id' => $request->category_id,
            'visibility' => 'display',
            'description' => $request->description ?? null,
            'price_setting' => $request->price_setting,
            'base_price' => $request->base_price,
            'branch_id' => json_encode($request->branch),
            'available_days' => $request->available_day,
            'specific_days' => $request->specify_day,
            'available_time' => $request->available_time,
            'available_from' => Carbon::parse($request->specify_start_time)
                                ->setTimezone('Asia/Kuala_Lumpur')
                                ->format('H:i:s'),
            'available_to' => Carbon::parse($request->specify_end_time)
                                ->setTimezone('Asia/Kuala_Lumpur')
                                ->format('H:i:s'),
            'stock_alert' => $request->stock_alert,
            'low_stock_threshold' => $request->low_stock ?? 0,
            'status' => 'active',
        ]);

        // remove deleted fixed item
        foreach ($request->deleted_fixed_item as $dfItem) {
            
            $deleteFixedItem = SetMealItem::find($dfItem);

            if ($deleteFixedItem) {
                $deleteFixedItem->delete();
            }
        }

        //create or update
        foreach ($request->fixed_item as $fItem) {

            $fixedItem = SetMealItem::find($fItem['id']);

            if ($fixedItem) {
                $setMeal->update([
                    'set_meal_id' => $setMeal->id,
                    'product_id' => $fItem['id'],
                    'quantity' => $fItem['quantity'],
                    'status' => 'active',
                ]);
            }

            if (!$fixedItem) {
                $fixedItem = SetMealItem::create([
                    'set_meal_id' => $setMeal->id,
                    'product_id' => $fItem['id'],
                    'quantity' => $fItem['quantity'],
                    'status' => 'active',
                ]);
            }
        }

        foreach ($request->selectable_group as $group) {

            $selectedGroup = SetMealGroup::find($group['id']);

            if ($selectedGroup) {
                $selectedGroup->update([
                    'set_meal_id' => $setMeal->id,
                    'group_name' => $group['group_name'],
                    'group_type' => $group['group_type'],
                    'group_selectable_type' => $group['group_selectable_type'],
                    'min_select' => $group['group_type'] === 'single-select' ? 1 : $group['min_select'],
                    'max_select' => $group['group_type'] === 'single-select' ? 1 : $group['max_select'],
                    'sort_order' => $group['sort_order'] ?? 0,
                ]);
            }

            if (!$selectedGroup) {
                $selectedGroup = SetMealGroup::create([
                    'set_meal_id' => $setMeal->id,
                    'group_name' => $group['group_name'],
                    'group_type' => $group['group_type'],
                    'group_selectable_type' => $group['group_selectable_type'],
                    'min_select' => $group['group_type'] === 'single-select' ? 1 : $group['min_select'],
                    'max_select' => $group['group_type'] === 'single-select' ? 1 : $group['max_select'],
                    'sort_order' => $group['sort_order'] ?? 0,
                ]);
            }

            if ($group['set_meal_group_item']) {
                foreach ($group['set_meal_group_item'] as $opt) {
                    $groupItem = SetMealGroupItem::find($opt['id']);

                    if ($groupItem) {
                        $groupItem->update([
                            'set_meal_group_id' => $selectedGroup->id,
                            'product_id' => $opt['id'],
                            'original_price' => $opt['prices'],
                            'additional_charge' => $opt['additional_charge'],
                            'quantity' => $opt['quantity'],
                        ]);
                    }
                }
            }

            if ($group['group_option']) {
                
                foreach ($group['group_option'] as $opt) {
                    $groupItem = SetMealGroupItem::create([
                        'set_meal_group_id' => $selectedGroup->id,
                        'product_id' => $opt['id'],
                        'original_price' => $opt['prices'],
                        'additional_charge' => $opt['additional_charge'],
                        'quantity' => $opt['quantity'],
                    ]);
                }
            }
        }

        return redirect()->back();
    }

}
