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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('set_meal_id')->nullable();
            $table->string('type'); // product, set_meal, point_redeem, reward
            $table->integer('qty');
            $table->decimal('price', 13, 2)->default(0.00);
            $table->decimal('total_price', 13, 2)->default(0.00);
            $table->string('status'); // (pending, preparing, served, cancelled)
            $table->string('remarks')->nullable(); 
            $table->string('sys_remarks')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
