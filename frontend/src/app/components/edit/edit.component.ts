import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { MatSnackBar } from '@angular/material';

import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: String;
  issue: any = {};
  updateForm: FormGroup;
  commentForm: FormGroup;
  hasComments: boolean = false;

  constructor(private issueService: IssueService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.createForms();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.issueService.getIssueById(this.id).subscribe((res) => {
        this.issue = res;
        this.updateForm.get('title').setValue(this.issue.title);
        this.updateForm.get('responsible').setValue(this.issue.responsible);
        this.updateForm.get('description').setValue(this.issue.description);
        this.updateForm.get('severity').setValue(this.issue.severity);
        this.updateForm.get('status').setValue(this.issue.status);

        this.hasComments = !!this.issue.comments.length;
      });
    });
  }

  createForms() {
    this.updateForm = this.fb.group({
      title: [ '', Validators.required ],
      responsible: '',
      description: '',
      severity: '',
      status: '',
    });
    this.commentForm = this.fb.group({
      name: [ '', Validators.required ],
      message: [ '', Validators.required ]
    });
  }

  addComment(commentName, commentMessage) {
    const timestamp = moment().format('MM/DD/YYYY h:mm A');
    this.issue.comments.push({
      name: commentName,
      message: commentMessage,
      timestamp
    });
    this.hasComments = true;
    this.commentForm.get('name').setValue('');
    this.commentForm.get('message').setValue('');
    this.issueService.addComment(this.id, commentName, commentMessage, timestamp).subscribe(() => {
      this.snackBar.open('Comment added.', 'OK', { duration: 3000 });
    });
  }

  updateIssue(title, responsible, description, severity, status) {
    this.issueService.updateIssue(this.id, title, responsible, description, severity, status).subscribe(() => {
      this.snackBar.open('Issue updated successfully.', 'OK', { duration: 3000 });
    });
  }
}
