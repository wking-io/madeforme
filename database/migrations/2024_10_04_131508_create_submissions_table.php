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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('url');
            $table->string('status')->default('pending');

            $table->foreignId('user_id')->constrained(table: 'users');

            $table->timestamps();
        });

        DB::statement("ALTER TABLE submissions ADD CONSTRAINT check_submission_status CHECK (status IN ('pending', 'ready', 'rejected', 'published'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE submissions DROP CONSTRAINT check_submission_status');
        Schema::dropIfExists('submissions');
    }
};
