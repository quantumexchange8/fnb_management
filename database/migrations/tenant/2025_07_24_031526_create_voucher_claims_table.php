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
        Schema::create('voucher_claims', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voucher_id');
            $table->string('method_type');
            $table->double('point')->nullable();
            $table->string('code_type')->nullable();
            $table->string('voucher_code')->nullable();
            $table->string('voucher_quantity')->nullable();
            $table->string('active_rule_type')->nullable();
            $table->json('tier')->nullable();
            $table->string('event_type')->nullable();
            $table->date('event_date')->nullable();
            $table->double('purchase_amount')->nullable();
            $table->dateTime('claim_windown_start')->nullable();
            $table->dateTime('claim_windown_end')->nullable();
            $table->string('claim_limit')->nullable();
            $table->integer('voucher_amount')->nullable();
            $table->integer('voucher_claimed')->nullable();
            $table->integer('voucher_usage')->nullable();
            $table->string('renew_type')->nullable();
            $table->double('voucher_member_amount')->nullable();
            $table->string('renew_member_type')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_claims');
    }
};
