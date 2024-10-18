<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isKing(); // or implement your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'media' => ['required', 'array'],
            'media.*.id' => ['required', 'exists:media,id'],
            'redirect_to' => ['string'],
        ];
    }

    public function getRedirectRoute(): string
    {
        return $this->safe()->redirect_to ?: 'media.index';
    }
}
