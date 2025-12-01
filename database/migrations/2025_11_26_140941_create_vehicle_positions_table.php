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
        Schema::create('vehicle_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('line_id')->nullable()->constrained('lines')->onDelete('cascade');
            $table->decimal('latitude',10,7);
            $table->decimal('longitude',10,7);
            $table->float('speed')->nullable();
            $table->float('bearing')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();

            $table->index(['vehicle_id','timestamp']);
            $table->index(['line_id','timestamp']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_positions', function (Blueprint $table) {
            Schema::dropIfExists('vehicle_positions');

        });
    }
};
