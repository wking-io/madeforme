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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique()->index();
            $table->json('description');
            $table->text('status')->default('draft');

            $table->timestamps();

        });

        DB::statement("ALTER TABLE posts ADD CONSTRAINT check_post_status CHECK (status IN ('draft', 'published'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE posts DROP CONSTRAINT check_post_status');
        Schema::dropIfExists('posts');
    }
};
