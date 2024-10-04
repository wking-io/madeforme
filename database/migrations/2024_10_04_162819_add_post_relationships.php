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
        //
        Schema::table('posts', function (Blueprint $table) {
            $table->foreignId('source_id')->nullable()->constrained(table: 'sources');
            $table->foreignId('preview_image_id')->nullable()->constrained(table: 'media');
            $table->foreignId('preview_video_id')->nullable()->constrained(table: 'media');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('source_id');
            $table->dropConstrainedForeignId('preview_image_id');
            $table->dropConstrainedForeignId('preview_video_id');
        });
    }
};
