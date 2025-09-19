<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_item_sets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_item_id');
            $table->unsignedBigInteger('product_id');
            $table->string('type'); // fixed, selectable
            $table->unsignedBigInteger('set_meal_group_id')->nullable(); // set meal group id
            $table->unsignedBigInteger('set_meal_group_product_id')->nullable(); // set meal group product id
            $table->decimal('charge', 13, 2)->default(0.00); // charge
            $table->integer('qty'); // quantity
            $table->string('remarks')->nullable(); // remarks
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_sets');
    }
};
