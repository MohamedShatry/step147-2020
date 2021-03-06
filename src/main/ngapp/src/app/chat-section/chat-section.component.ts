import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Chat } from '../models/chat';

@Component({
  selector: 'app-chat-section',
  templateUrl: './chat-section.component.html',
  styleUrls: ['./chat-section.component.css'],
})
export class ChatSectionComponent implements OnInit {
  @Output() emitMessage: EventEmitter<String> = new EventEmitter();
  @Input() selectedUser: Chat;
  @Input() messageInTransit: boolean;

  currId: string;
  constructor() {}

  ngOnInit() {
    const localUser = JSON.parse(localStorage.getItem('user'));
    this.currId = localUser.uid;
  }

  sendMessage(event) {
    if (event.message.trim() === '') {
      return;
    }
    this.emitMessage.emit(event.message);
  }
}
