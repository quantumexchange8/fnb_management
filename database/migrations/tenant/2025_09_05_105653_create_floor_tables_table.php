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
        Schema::create('floor_tables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('table_layout_id');
            $table->string('table_id');
            $table->string('table_name');
            $table->integer('pax')->default(1);
            $table->enum('status', ['available', 'occupied', 'reserved'])->default('available');
            $table->string('available_color')->default('#fcfcfc');
            $table->string('in_use_color')->default('#fcfcfc');
            $table->string('reserved_color')->default('#fcfcfc');
            $table->unsignedBigInteger('current_order_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('floor_tables');
    }
};
