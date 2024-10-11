<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StoreRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $posts = Post::all(['id', 'title', 'description']);

        return Inertia::render('Post/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
        return Inertia::render('Post/Create', [
            'sources' => Source::all(['id', 'name']),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        // Needed to have post id for redirect.
        $post = DB::transaction(function () use ($request) {
            $post = Post::make($request->postPayload());

            $post->source()->associate($request->sourceId() ?? Source::create($request->sourcePayload()));

            $post->previewImage()->create($request->previewImagePayload());
            $post->previewVideo()->create($request->previewVideoPayload());

            foreach ($request->safe()->media as $media) {
                $post->media()->create($request->mediaPayload($media));
            }

            foreach ($request->safe()->categories as $category) {
                $post->categories()->associate($category['id'] ?? Category::create($category));
            }

            return tap($post)->save();
        });

        return to_route('post.edit', ['post' => $post])->with('toasts', ['kind' => 'success', 'message' => 'Post created successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $post->with(['source', 'previewImage']);
        $post->preview_image_url = $post->previewImage ? Storage::temporaryUrl($post->previewImage->path, now()->addHour()) : null;

        return Inertia::render('Post/Edit', ['sources' => Source::all(['id', 'name']), 'post' => $post, 'categories' => Category::all(['id', 'name'])]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
