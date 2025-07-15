import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  status?: 'sent' | 'delivered' | 'read';
}

interface SupportSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'waiting' | 'closed';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: ChatMessage[];
  createdAt: Date;
  assignedAgent?: string;
}

@Component({
  selector: 'app-tech-support',
  templateUrl: './tech-support.component.html',
  styleUrls: ['./tech-support.component.scss']
})
export class TechSupportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isOpen = false;
  isMinimized = false;
  isTyping = false;
  currentSession: SupportSession | null = null;
  
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  
  supportCategories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'account', label: 'Account Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'training', label: 'Training Support' },
    { value: 'other', label: 'Other' }
  ];
  
  priorityLevels = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#fd7e14' },
    { value: 'urgent', label: 'Urgent', color: '#dc3545' }
  ];

  // Simulated support agents
  supportAgents = [
    { id: 'agent1', name: 'Sarah Johnson', status: 'online', avatar: 'assets/images/support/agent1.jpg' },
    { id: 'agent2', name: 'Mike Chen', status: 'busy', avatar: 'assets/images/support/agent2.jpg' },
    { id: 'agent3', name: 'Emma Wilson', status: 'away', avatar: 'assets/images/support/agent3.jpg' }
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['technical', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  ngOnInit(): void {
    // Ensure chat starts closed
    this.isOpen = false;
    this.isMinimized = false;
    
    this.initializeChat();
    this.loadPreviousSession();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeChat(): void {
    // Add welcome message
    this.addSystemMessage('Welcome to NCD Support! How can we help you today?');
    
    // Simulate typing indicator after welcome
    setTimeout(() => {
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addSupportMessage('Hi! I\'m here to help you with any questions or issues you might have. Please select a category and describe your issue.');
      }, 2000);
    }, 1000);
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.isMinimized = false;
    
    if (this.isOpen && !this.currentSession) {
      this.startNewSession();
    }
  }

  minimizeChat(): void {
    this.isMinimized = true;
  }

  maximizeChat(): void {
    this.isMinimized = false;
  }

  trackByMessageId(index: number, message: any): string {
    return message.id || index;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
    
    // Clear any typing indicators
    this.isTyping = false;
    
    if (this.currentSession) {
      this.endSession();
    }
    
    // Optional: Clear the chat form
    this.chatForm.get('message')?.setValue('');
  }

  startNewSession(): void {
    const user = this.getCurrentUser();
    
    this.currentSession = {
      id: this.generateSessionId(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: 'waiting',
      category: 'technical',
      priority: 'medium',
      messages: [...this.messages],
      createdAt: new Date(),
      assignedAgent: this.getAvailableAgent()
    };
    
    this.toastr.info('Support session started', 'Tech Support');
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'closed';
      this.addSystemMessage('Support session ended. Thank you for contacting NCD Support!');
      
      // Save session for future reference
      this.saveSession(this.currentSession);
      this.currentSession = null;
      
      this.toastr.success('Support session ended', 'Tech Support');
    }
  }

  sendMessage(): void {
    if (this.chatForm.valid && this.chatForm.value.message.trim()) {
      const message: ChatMessage = {
        id: this.generateMessageId(),
        sender: 'user',
        message: this.chatForm.value.message.trim(),
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      
      this.messages.push(message);
      this.chatForm.get('message')?.setValue('');
      
      // Simulate support response
      this.simulateSupportResponse(message);
      
      // Update session
      if (this.currentSession) {
        this.currentSession.messages.push(message);
        this.currentSession.category = this.chatForm.value.category;
        this.currentSession.priority = this.chatForm.value.priority;
      }
      
      this.scrollToBottom();
    }
  }

  simulateSupportResponse(userMessage: ChatMessage): void {
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate response delay
    setTimeout(() => {
      this.hideTypingIndicator();
      
      const responses = this.generateSupportResponse(userMessage.message);
      responses.forEach((response, index) => {
        setTimeout(() => {
          this.addSupportMessage(response);
        }, index * 1000);
      });
    }, 1500 + Math.random() * 2000);
  }

  generateSupportResponse(userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    // Technical issues
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('not working')) {
      return [
        'I understand you\'re experiencing a technical issue. Let me help you troubleshoot this.',
        'Can you please provide more details about when this error occurs?',
        'Also, what browser and operating system are you using?'
      ];
    }
    
    // Login issues
    if (lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('access')) {
      return [
        'I can help you with login issues.',
        'Have you tried resetting your password using the "Forgot Password" link?',
        'If that doesn\'t work, I can reset it for you. Please verify your email address.'
      ];
    }
    
    // Training related
    if (lowerMessage.includes('training') || lowerMessage.includes('course') || lowerMessage.includes('session')) {
      return [
        'I can help you with training-related questions.',
        'Are you looking to upload training registers, add new training sessions, or manage trainers?',
        'Please let me know what specific training feature you need help with.'
      ];
    }
    
    // Patient management
    if (lowerMessage.includes('patient') || lowerMessage.includes('medical') || lowerMessage.includes('record')) {
      return [
        'I can assist you with patient management features.',
        'Are you having trouble adding new patients or accessing existing patient records?',
        'Please describe the specific issue you\'re encountering.'
      ];
    }
    
    // Reports
    if (lowerMessage.includes('report') || lowerMessage.includes('data') || lowerMessage.includes('export')) {
      return [
        'I can help you with reporting features.',
        'Are you trying to generate reports or export data?',
        'What type of report are you looking to create?'
      ];
    }
    
    // Default response
    return [
      'Thank you for your message. I\'m here to help!',
      'Can you please provide more details about your issue so I can assist you better?',
      'You can also attach screenshots if that would be helpful.'
    ];
  }

  addSupportMessage(message: string): void {
    const supportMessage: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'support',
      message: message,
      timestamp: new Date(),
      type: 'text',
      status: 'delivered'
    };
    
    this.messages.push(supportMessage);
    
    if (this.currentSession) {
      this.currentSession.messages.push(supportMessage);
    }
    
    this.scrollToBottom();
  }

  addSystemMessage(message: string): void {
    const systemMessage: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'support',
      message: message,
      timestamp: new Date(),
      type: 'system'
    };
    
    this.messages.push(systemMessage);
    this.scrollToBottom();
  }

  showTypingIndicator(): void {
    this.isTyping = true;
    this.scrollToBottom();
  }

  hideTypingIndicator(): void {
    this.isTyping = false;
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.toastr.error('File size must be less than 5MB', 'File Upload Error');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('Only images, PDF, and text files are allowed', 'File Upload Error');
        return;
      }
      
      // Create file message
      const fileMessage: ChatMessage = {
        id: this.generateMessageId(),
        sender: 'user',
        message: `Uploaded file: ${file.name}`,
        timestamp: new Date(),
        type: 'file',
        status: 'sent'
      };
      
      this.messages.push(fileMessage);
      
      // Simulate file processing
      setTimeout(() => {
        this.addSupportMessage('Thank you for the file upload. I\'m reviewing it now and will get back to you shortly.');
      }, 1000);
      
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getCurrentUser(): any {
    // In real app, get from auth service
    return {
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@hospital.com'
    };
  }

  getAvailableAgent(): string {
    const onlineAgents = this.supportAgents.filter(agent => agent.status === 'online');
    return onlineAgents.length > 0 ? onlineAgents[0].id : 'agent1';
  }

  generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  generateMessageId(): string {
    return 'msg_' + Math.random().toString(36).substr(2, 9);
  }

  saveSession(session: SupportSession): void {
    // In real app, save to backend
    localStorage.setItem('supportSession_' + session.id, JSON.stringify(session));
  }

  loadPreviousSession(): void {
    // In real app, load from backend
    const savedSessions = Object.keys(localStorage)
      .filter(key => key.startsWith('supportSession_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
    
    // Load most recent active session but don't auto-open
    const activeSession = savedSessions.find(session => session.status === 'active');
    if (activeSession) {
      this.currentSession = activeSession;
      this.messages = [...activeSession.messages];
      // Don't auto-open chat, let user decide
    }
  }

  getPriorityColor(priority: string): string {
    const priorityLevel = this.priorityLevels.find(p => p.value === priority);
    return priorityLevel ? priorityLevel.color : '#6c757d';
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
