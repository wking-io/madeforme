<?php

namespace App\Http\Controllers;

use App\Http\Requests\Media\StoreRequest;
use App\Models\Media;
use App\Services\GenerateSignedUploadUrl\FileUploadConfiguration;
use App\Services\GenerateSignedUploadUrl\GenerateSignedUploadUrl;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return to_route('media.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $file = UploadedFile::fake()->create($request->payload());

        $generator = new GenerateSignedUploadUrl;
        $signedUrl = FileUploadConfiguration::isUsingCloud() ? $generator->forCloud($file) : $generator->forLocal();

        return response()->json(['url' => $signedUrl]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Media $media)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Media $media)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        //
    }
}
