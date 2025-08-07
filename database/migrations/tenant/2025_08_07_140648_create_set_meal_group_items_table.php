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
        Schema::create('set_meal_group_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('set_meal_group_id');
            $table->unsignedBigInteger('product_id');
            $table->decimal('original_price', 13, 2);
            $table->decimal('additional_charge', 13, 2);
            $table->integer('quantity');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('set_meal_group_items');
    }
};
