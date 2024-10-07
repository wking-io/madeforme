<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StoreRequest;
use App\Models\Media;
use App\Models\Post;
use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        return Inertia::render('Post/Index', ['posts' => $posts]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
        return Inertia::render('Post/Create', ['sources' => Source::all(['id', 'name'])]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $validatedData = $request->validated();

        // Needed to have post id for redirect.
        $post_id = null;
        DB::transaction(function () use ($validatedData, &$post_id) {
            $post = Post::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'slug' => $validatedData['slug'],
            ]);

            if (! empty($validatedData['source_id'])) {
                $post->source_id = $validatedData['source_id'];
            } else {
                $source = Source::create([
                    'name' => $validatedData['source_name'],
                    'url' => $validatedData['source_url'],
                ]);
                $post->source_id = $source->id;
            }

            if (! empty($validatedData['preview_image'])) {
                $path = $validatedData['preview_image']->store('posts');
                $media = Media::create([
                    'path' => $path,
                ]);
                $post->preview_image_id = $media->id;
            }

            $post->save();

            $post_id = $post->id;
        });

        return to_route('post.edit', ['post' => $post_id])->with('toasts', ['kind' => 'success', 'message' => 'Post created successfully.']);
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
        $post->load('source', 'previewImage');

        return Inertia::render('Post/Edit', ['sources' => Source::all(['id', 'name']), 'post' => $post]);
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
