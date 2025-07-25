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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('item_code')->unique();
            $table->unsignedBigInteger('category_id');
            $table->decimal('prices', 13, 2)->default(0.00);
            $table->decimal('cost', 13, 2)->nullable();
            $table->decimal('reward_point', 13, 2)->nullable()->default(0.00);
            $table->enum('visibility', ['display', 'hidden']);
            $table->longText('description')->nullable();
            $table->integer('inventory')->nullable();
            $table->enum('status', ['active', 'inactive']);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
