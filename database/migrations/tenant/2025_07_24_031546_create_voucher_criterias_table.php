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
        Schema::create('voucher_criterias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voucher_id');
            $table->string('validaty_value')->nullable();
            $table->string('validaty_type')->nullable();
            $table->string('requirement_type')->nullable();
            $table->double('min_amount')->nullable();
            $table->double('min_quantity')->nullable();
            $table->string('valid_dt_type')->nullable();
            $table->date('specific_date')->nullable();
            $table->time('specific_time_start')->nullable();
            $table->time('specific_time_end')->nullable();
            $table->string('eligible_member')->nullable();
            $table->string('specific_segment')->nullable();
            $table->string('eligible_product_type')->nullable();
            $table->json('eligible_category')->nullable();
            $table->json('eligible_product')->nullable();
            $table->string('stacking_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_criterias');
    }
};
