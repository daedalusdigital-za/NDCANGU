import { Component, OnInit } from '@angular/core';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-list-faqs',
  templateUrl: './list-faqs.component.html',
  styleUrls: ['./list-faqs.component.scss']
})
export class ListFaqsComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'all';
  
  categories = [
    { id: 'all', name: 'All Categories', icon: 'fas fa-th-large' },
    { id: 'general', name: 'General Health', icon: 'fas fa-heartbeat' },
    { id: 'tests', name: 'Medical Tests', icon: 'fas fa-vial' },
    { id: 'account', name: 'Account Management', icon: 'fas fa-user-cog' },
    { id: 'privacy', name: 'Privacy & Security', icon: 'fas fa-shield-alt' }
  ];

  faqs: FAQ[] = [
    {
      id: 1,
      question: "What is Total Cholesterol?",
      answer: "Total cholesterol is the overall amount of cholesterol in the blood, measured in mg/dL or mmol/L. It includes both 'bad' LDL cholesterol and 'good' HDL cholesterol. The desirable level is less than 200 mg/dL (5.2 mmol/L), but it can vary based on other risk factors for heart disease. Working with a healthcare provider is essential for managing cholesterol levels and reducing the risk of heart disease.",
      category: "tests",
      icon: "fas fa-chart-line"
    },
    {
      id: 2,
      question: "What is a Normal Glucose Level?",
      answer: "A normal glucose level after an overnight fast is between 70-99 mg/dL (3.9 to 5.5 mmol/L) for adults. After eating, it should return to normal within a few hours, and a postprandial glucose level of less than 140 mg/dL (7.8 mmol/L) is considered normal. Blood glucose levels outside the normal range can indicate various health conditions.",
      category: "tests",
      icon: "fas fa-tint"
    },
    {
      id: 3,
      question: "What is HbA1C?",
      answer: "HbA1C is a blood test that measures the average blood sugar level over the past 2 to 3 months. It's used to diagnose and monitor diabetes and evaluate the effectiveness of treatment. The higher the HbA1c level, the greater the risk of diabetes-related complications.",
      category: "tests",
      icon: "fas fa-microscope"
    },
    {
      id: 4,
      question: "What is Uric Acid?",
      answer: "Uric acid is a waste product produced when the body breaks down purines. It's filtered out of the blood by the kidneys and excreted in urine. High levels of uric acid in the blood (hyperuricemia) can lead to the formation of urate crystals that cause gout or kidney stones, and may increase the risk of heart disease, hypertension, and metabolic syndrome.",
      category: "tests",
      icon: "fas fa-pills"
    },
    {
      id: 5,
      question: "What are high ketones?",
      answer: "High ketones occur when there's an excess of ketone bodies in the bloodstream due to a lack of carbohydrates or insulin, especially in people with diabetes. Ketosis is a normal metabolic state, but high ketone levels can be dangerous and lead to diabetic ketoacidosis (DKA), which causes symptoms like vomiting, abdominal pain, and confusion.",
      category: "tests",
      icon: "fas fa-flask"
    },
    {
      id: 6,
      question: "What is Lactate?",
      answer: "Lactate is produced by the body during intense exercise or when there's a lack of oxygen to the cells. High lactate levels in the blood, known as hyperlactatemia, can indicate an underlying health problem, including impaired liver or kidney function, sepsis, shock, certain medications, or medical conditions like diabetes or mitochondrial disease.",
      category: "tests",
      icon: "fas fa-running"
    },
    {
      id: 7,
      question: "How do I manage my account?",
      answer: "Account management involves updating your personal information, changing passwords, managing notification preferences, and accessing your medical records. You can access these features through your user dashboard or by contacting our support team.",
      category: "account",
      icon: "fas fa-user-edit"
    },
    {
      id: 8,
      question: "How can I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a secure link to create a new password. Make sure to choose a strong password that includes letters, numbers, and special characters.",
      category: "account",
      icon: "fas fa-key"
    },
    {
      id: 9,
      question: "Is my medical data secure?",
      answer: "Yes, we take data security very seriously. All medical data is encrypted both in transit and at rest. We comply with HIPAA regulations and use industry-standard security measures to protect your personal health information.",
      category: "privacy",
      icon: "fas fa-lock"
    },
    {
      id: 10,
      question: "Who can access my medical records?",
      answer: "Only authorized healthcare providers involved in your care can access your medical records. You have complete control over who can view your information and can revoke access at any time through your account settings.",
      category: "privacy",
      icon: "fas fa-user-shield"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    
  }

  get filteredFAQs(): FAQ[] {
    let filtered = this.faqs;
    
    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }

  toggleFAQ(faq: FAQ): void {
    faq.expanded = !faq.expanded;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  getCategoryTitle(): string {
    if (this.selectedCategory === 'all') {
      return 'All Questions';
    }
    const category = this.categories.find(c => c.id === this.selectedCategory);
    return category ? category.name : 'Questions';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  resetFilters(): void {
    this.clearSearch();
    this.selectCategory('all');
  }
}
