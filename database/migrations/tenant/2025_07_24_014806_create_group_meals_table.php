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
        Schema::create('group_meals', function (Blueprint $table) {
            $table->id();
            $table->string('group_name');
            $table->enum('group_type', ['single', 'multiple']);
            $table->string('selectable_type')->nullable();
            $table->integer('min')->nullable();
            $table->integer('max')->nullable();
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_meals');
    }
};
