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
        Schema::create('set_meals', function (Blueprint $table) {
            $table->id();
            $table->string('set_name');
            $table->string('set_code')->unique();
            $table->integer('no_of_pax');
            $table->unsignedBigInteger('category_id');
            $table->enum('visibility', ['display', 'hidden']);
            $table->longText('description')->nullable();
            $table->string('price_setting');
            $table->decimal('base_price', 13, 2)->default(0.00);
            $table->json('branch_id');
            $table->string('available_days');
            $table->string('specific_days')->nullable();
            $table->string('available_time');
            $table->time('available_from')->nullable();
            $table->time('available_to')->nullable();
            $table->enum('stock_alert', ['enable', 'disable']);
            $table->integer('low_stock_threshold')->default(0);
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('set_meals');
    }
};
