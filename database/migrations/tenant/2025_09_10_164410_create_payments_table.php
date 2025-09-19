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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('receipt_no');
            $table->string('payment_method');  // cash, card, ewallet, split
            $table->json('paid_for_item')->nullable();  
            $table->decimal('amount', 13, 2)->default(0.00);  
            $table->decimal('sst_amount', 13, 2)->default(0.00);  
            $table->decimal('service_charge', 13, 2)->default(0.00);  
            $table->decimal('discount_amount', 13, 2)->default(0.00);  
            $table->decimal('total_amount', 13, 2)->default(0.00);
            $table->decimal('points', 13, 2)->default(0.00);
            $table->string('status');
            $table->dateTime('payment_time')->nullable(); // transaction time
            $table->unsignedBigInteger('handle_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
