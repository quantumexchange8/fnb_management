<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Category;
use App\Models\Tenant\ModifierGroup;
use App\Models\Tenant\ModifierGroupItem;
use App\Models\Tenant\ModifierItem;
use App\Models\Tenant\Product;
use Illuminate\Http\Request;
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

    public function getCategories(Request $request)
    {

        $categories = Category::where('status', 'active')->orderBy('order_no')->get();

        return response()->json([
            'data' => $categories,
            'total' => $categories->count(),
        ]);
    }

    public function getModifier()
    {

        $modifiers = ModifierGroup::where('status', 'active')->get();

        return response()->json($modifiers);
    }

    public function getProducts(Request $request)
    {
        
        $query = Product::with('category:id,name');

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->paginate(12));
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

    // POST METHOD

    public function storeCategory(Request $request)
    {

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'visibility' => 'required|string',
            'description' => 'nullable|string',
            'category_color' => 'required|string|max:7', // Assuming color is a hex code
        ]);

        $category = Category::create([
            'name' => $request->name,
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

        // dd($request->all());

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

        if (!$findCategory) {

            foreach ($request->new_category as $category) {
                if ($category['id'] === $request->category_id) {

                    $findCategory = Category::create([
                        'name' => $category['name'],
                        'visibility' => $category['category_visibility'],
                        'color' => $category['color'],
                        'description' => $category['description'],
                        'status' => 'active',
                    ]);
                }
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
            'modifier_item.*.modifier_name' => 'required|string|max:255',
            'modifier_item.*.price' => 'required|numeric', // or use 'required' if price can be non-numeric
        ]);

        $modifierGroup = ModifierGroup::create([
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
            'modifier_name' => $request->modifier_name,
            'price' => $request->price,
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

}
