<?php

namespace App\Mail;

use App\Models\Patient;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PatientWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $patient;
    public $action; // 'created' or 'updated'

    public function __construct(Patient $patient, $action = 'created')
    {
        $this->patient = $patient;
        $this->action = $action;
    }

    public function envelope(): Envelope
    {
        if ($this->action === 'created') {
            return new Envelope(
                subject: 'Welcome to DCM Dental Chamber! 🦷',
            );
        } else {
            return new Envelope(
                subject: 'Your Patient Profile Has Been Updated - DCM Dental Chamber',
            );
        }
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.patient-welcome',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
