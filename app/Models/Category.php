<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    // Many-to-many relationship with Post
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    // Self-referential relationship for nested categories
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Optional: If you want to access the parent category
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}
