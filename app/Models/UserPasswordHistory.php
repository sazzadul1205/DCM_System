<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class UserPasswordHistory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_password_history';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'password_hash',
        'changed_at',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'changed_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the user that owns the password history.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the creator of this password history.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Helper Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Check if password was used in last N changes
     */
    public static function wasUsedBefore($userId, $password, $limit = 3): bool
    {
        $recentPasswords = self::where('user_id', $userId)
            ->orderBy('changed_at', 'desc')
            ->limit($limit)
            ->get();

        foreach ($recentPasswords as $history) {
            if (Hash::check($password, $history->password_hash)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Clean up old password history (keep last 3 entries)
     */
    public static function cleanupOldHistory($userId, $keep = 3): void
    {
        $oldEntries = self::where('user_id', $userId)
            ->orderBy('changed_at', 'desc')
            ->skip($keep)
            ->take(PHP_INT_MAX)
            ->get();

        foreach ($oldEntries as $entry) {
            $entry->delete();
        }
    }
}
