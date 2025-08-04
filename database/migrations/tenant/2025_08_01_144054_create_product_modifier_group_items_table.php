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
        Schema::create('product_modifier_group_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_modifier_group_id');
            $table->unsignedBigInteger('modifier_item_id');
            $table->string('modifier_name');
            $table->decimal('modifier_price', 13, 2);
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_modifier_group_items');
    }
};
