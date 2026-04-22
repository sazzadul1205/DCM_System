<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

use Exception;

class UidGenerator
{
  /**
   * Generate a unique ID with retry mechanism
   *
   * @param string $prefix (PID / UID)
   * @param string $table
   * @param string $column
   * @param int $length (random digit length: 16, 32, 64...)
   * @param int $maxAttempts
   * @return string
   * @throws Exception
   */
  public static function generate(
    string $prefix,
    string $table,
    string $column = 'uid',
    int $length = 16,
    int $maxAttempts = 5
  ): string {
    $date = now()->format('dmY');

    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {

      // Generate numeric string (not Str::random because that includes letters)
      $random = self::numericString($length);

      $uid = "{$prefix}-{$date}-{$random}";

      $exists = DB::table($table)
        ->where($column, $uid)
        ->exists();

      if (!$exists) {
        return $uid;
      }
    }

    throw new Exception("Unable to generate unique ID after {$maxAttempts} attempts. Try again or contact support.");
  }

  /**
   * Generate numeric string of given length
   */
  protected static function numericString(int $length): string
  {
    $digits = '';

    while (strlen($digits) < $length) {
      $digits .= random_int(0, 9);
    }

    return substr($digits, 0, $length);
  }
}
