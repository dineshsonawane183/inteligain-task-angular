import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MatTreeFlatDataSource, MatTreeFlattener, MAT_DIALOG_DATA } from '@angular/material';
import { of as ofObservable, Observable, BehaviorSubject } from "rxjs";
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-permission-dashboard',
  templateUrl: './permission-dashboard.component.html',
  styleUrls: ['./permission-dashboard.component.css'],
})
export class PermissionDashboardComponent implements OnInit {

  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<
    TodoItemNode[]
  >([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PermissionDashboardComponent>,
    private appService: AppService,
    private toastr: NotificationService,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any
  ) {
    this.initialize();
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  permissionForm: FormGroup = this.fb.group({
    permission_code: ["", Validators.required],
    permission_desc: ["", Validators.required],
  });
  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  buildFileTree(value: any, level: number) {
    let data: any[] = [];
    for (let k in value) {
      let v = value[k];
      let node = new TodoItemNode();
      node.item = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === "object") {
        node.children = this.buildFileTree(v, level + 1);
      } else {
        node.item = v;
      }
      data.push(node);
    }
    return data;
  }

  ngOnInit() {
  }
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<
    TodoItemFlatNode,
    TodoItemNode
  >();

  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<
    TodoItemNode,
    TodoItemFlatNode
  >();
  selectedParent: TodoItemFlatNode | null = null;

  newItemName: string = "";
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );


  getLevel = (node: TodoItemFlatNode) => {
    return node.level;
  };

  isExpandable = (node: TodoItemFlatNode) => {
    return node.expandable;
  };

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.children);
  };

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => {
    return _nodeData.expandable;
  };

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => {
    return _nodeData.item === "";
  };

  transformer = (node: TodoItemNode, level: number) => {
    let flatNode =
      this.nestedNodeMap.has(node) &&
        this.nestedNodeMap.get(node)!.item === node.item
        ? this.nestedNodeMap.get(node)!
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

  }
  onPermissionSubmit(formDirective: FormGroupDirective) {

    const parentPermissions = ["Employee Management", "User Management", "Admin Management"];
    const selectedPermissions = this.checklistSelection.selected;
    const finalPermissionArr = [];
    selectedPermissions.forEach((permission) => {
      if (parentPermissions.indexOf(permission.item) == -1) {
        finalPermissionArr.push(permission.item);
      }
    })
    if (this.permissionForm.valid) {
      let params = {
        ...this.permissionForm.value,
        permission_array: finalPermissionArr
      }
      this.appService.createPermission(params).subscribe((res: any) => {
        this.permissionForm.reset();
        formDirective.resetForm();
        this.close();
        this.toastr.showSuccess("Permission saved successfully", "Success")
      });
    }
  }

  close(){
    this.dialogRef.close();
  }
}
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

const TREE_DATA = {
  "Employee Management": {
    "emp_read": "View Employees",
    "emp_create": "Create Employee",
    "emp_edit": "Edit Employee",
    "emp_delete": "Delete Employee"
  },
  "User Management": {
    "usr_read": "View Users",
    "usr_edit": "Edit Users",
    "usr_delete": "Delete Users"
  },
  "Admin Management": {
    "role_view": "View Role",
    "role_edit": "Edit Role",
    "role_create": "Create Role",
    "role_delete": "Delete Role",
    "permission_delete": "Delete Permission",
    "permission_create": "Create Permission",
  },
};

