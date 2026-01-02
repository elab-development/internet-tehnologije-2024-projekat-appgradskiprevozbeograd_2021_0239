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
        Schema::table('favorites', function (Blueprint $table) {
            Schema::dropIfExists('favorites');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('fav_type');
            $table->unsignedBigInteger('fav_id');
            $table->timestamps();
        });

    }
};
