<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->string('status')->default('pending');
            $table->number('order')->nullable();

            $table->foreignId('post_id')->nullable()->constrained(table: 'posts');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE media ADD CONSTRAINT check_media_status CHECK (status IN ('pending', 'confirmed'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropConstrainedForeignId('post_id');
        });
        Schema::dropIfExists('media');
    }
};
