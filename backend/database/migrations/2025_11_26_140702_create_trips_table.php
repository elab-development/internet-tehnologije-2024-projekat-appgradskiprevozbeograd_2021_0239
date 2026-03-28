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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('line_id')->constrained('lines')->onDelete('cascade');
            $table->date('service_date');
            $table->time('scheduled_start_time');
            $table->enum('status',['scheduled','active','finished','cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('line_id')->constrained('lines')->onDelete('cascade');
            $table->date('service_date');
            $table->time('scheduled_start_time');
            $table->enum('status',['scheduled','active','finished','cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }
};
