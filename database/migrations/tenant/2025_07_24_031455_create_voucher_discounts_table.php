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
        Schema::create('voucher_discounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voucher_id');
            $table->string('voucher_type');
            $table->string('discount_rate_type')->nullable();
            $table->double('discount_rate')->default(0);
            $table->string('discount_limit')->nullable();
            $table->double('discount_capped')->default(0);
            $table->string('structure_type')->nullable();
            $table->json('eligible_product_id')->nullable();
            $table->integer('buy_amount')->nullable();
            $table->integer('get_amount')->nullable();
            $table->integer('off_amount')->nullable();
            $table->string('discount_on')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_discounts');
    }
};
