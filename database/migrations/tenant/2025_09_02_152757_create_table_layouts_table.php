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
        Schema::create('table_layouts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('layout_json')->nullable();
            $table->string('floor')->default('1');
            $table->string('table_id')->nullable();
            $table->string('order_no')->nullable();
            $table->string('available_color')->default('#fcfcfc');
            $table->string('in_use_color')->default('#fcfcfc');
            $table->string('reserved_color')->default('#fcfcfc');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_layouts');
    }
};
