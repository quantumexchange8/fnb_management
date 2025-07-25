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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_sys_ids');
            $table->string('name');
            $table->string('campaign_period')->nullable();
            $table->dateTime('campaign_period_start')->nullable();
            $table->dateTime('campaign_period_end')->nullable();
            $table->json('branch')->nullable();
            $table->string('service_type')->nullable();
            $table->string('claim_method')->nullable();
            $table->longText('tnc')->nullable();
            $table->string('status')->nullable();
            $table->string('usage_status')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
