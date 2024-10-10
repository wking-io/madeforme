<?php

namespace App\Enums;

enum PostStatus: string
{
    case draft = 'draft';
    case published = 'published';
}
