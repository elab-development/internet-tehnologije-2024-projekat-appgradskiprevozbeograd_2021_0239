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
        Schema::create('trip_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained('trips')->onDelete('cascade');
            $table->foreignId('station_id')->constrained('stations')->onDelete('cascade');
            $table->integer('stop_sequence');
            $table->dateTime('scheduled_arrival')->nullable();
            $table->dateTime('scheduled_departure')->nullable();
            $table->timestamps();

            $table->unique(['trip_id','stop_sequence']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trip_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained('trips')->onDelete('cascade');
            $table->foreignId('station_id')->constrained('stations')->onDelete('cascade');
            $table->integer('stop_sequence');
            $table->dateTime('scheduled_arrival')->nullable();
            $table->dateTime('scheduled_departure')->nullable();
            $table->timestamps();

            $table->unique(['trip_id','stop_sequence']);
        });
    }
};
