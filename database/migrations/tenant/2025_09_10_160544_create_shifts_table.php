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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->date('shift_date');
            $table->string('shift_number');
            $table->unsignedBigInteger('terminal_id')->nullable();
            $table->unsignedBigInteger('opened_user_id')->nullable();
            $table->unsignedBigInteger('closed_user_id')->nullable();
            $table->time('opening_time');
            $table->time('closing_time')->nullable();
            $table->decimal('starting_cash', 13, 2)->default(0.00);
            $table->decimal('total_pay_in', 13, 2)->default(0.00);
            $table->decimal('total_pay_out', 13, 2)->default(0.00);
            $table->decimal('actual_amount', 13, 2)->default(0.00); // cash balance total 
            $table->decimal('expected_closing_cash', 13, 2)->default(0.00); // cash balance total 
            $table->decimal('different_amount', 13, 2)->default(0.00); // check total balance and earned diff amount 差价
            $table->decimal('total_cash_sales', 13, 2)->default(0.00); // pay by cash
            $table->decimal('total_card_sales', 13, 2)->default(0.00); // pay by card
            $table->decimal('total_ewallet_sales', 13, 2)->default(0.00); // pay by tng or others platform
            $table->decimal('total_sales', 13, 2)->default(0.00); // sum amount
            $table->string('shift_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
