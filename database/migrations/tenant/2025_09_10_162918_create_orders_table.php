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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shift_id');
            $table->unsignedBigInteger('user_id');
            $table->string('order_no')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('table_id')->nullable();
            $table->string('table_name')->nullable();
            $table->integer('pax')->nullable();
            $table->string('status');
            $table->decimal('subtotal', 13, 2)->default(0.00);
            $table->decimal('tax', 13, 2)->default(0.00);
            $table->decimal('service_charge', 13, 2)->default(0.00);
            $table->decimal('discount', 13, 2)->default(0.00);
            $table->decimal('total', 13, 2)->default(0.00);
            $table->string('remark')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
