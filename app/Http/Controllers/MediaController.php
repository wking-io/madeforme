<?php

namespace App\Http\Controllers;

use App\Data\SignedUploadData;
use App\Http\Requests\Media\ConfirmRequest;
use App\Http\Requests\Media\SignRequest;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $media = Media::all(['id', 'path', 'status']);

        return Inertia::render('media/index', [
            'media' => $media,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('media/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function sign(SignRequest $request)
    {

        $signedData = collect([]);

        collect($request->uploads)->each(function ($file) use ($signedData) {
            $path = data_get($file, 'path');
            $content_type = data_get($file, 'content_type');

            ['url' => $url, 'headers' => $headers] = Storage::temporaryUploadUrl($path, now()->addMinutes(5), [
                'ACL' => 'private',
                'ContentType' => $content_type,
                'CacheControl' => null,
            ]
            );

            $headers['Content-Type'] = $content_type;

            $media = Media::create([
                'path' => data_get($file, 'path'),
            ]);

            $signedData->push([
                'id' => $media->id,
                'path' => $path,
                'url' => $url,
                'headers' => $headers,
            ]);
        });

        return response()->json(SignedUploadData::collect($signedData));
    }

    /**
     * Display the specified resource.
     */
    public function show(
        Media $media
    ) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        Media $media
    ) {
        //
    }

    public function confirm(
        ConfirmRequest $request
    ) {
        Media::whereIn('id', $request->safe()->media)->update(['status' => 'confirmed']);

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Media $media
    ) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Media $media
    ) {
        //
    }
}
