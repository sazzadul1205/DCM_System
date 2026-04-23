<?php

namespace App\Rules;

use App\Models\UserPasswordHistory;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PasswordHistory implements ValidationRule
{
  protected $userId;
  protected $limit;

  public function __construct($userId, $limit = 5)
  {
    $this->userId = $userId;
    $this->limit = $limit;
  }

  /**
   * Run the validation rule.
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    if (UserPasswordHistory::wasUsedBefore($this->userId, $value, $this->limit)) {
      $fail("You cannot use a password that you've used in your last {$this->limit} password changes.");
    }
  }
}
