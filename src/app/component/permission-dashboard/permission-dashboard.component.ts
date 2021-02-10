import { Component, OnInit, Inject, Injectable, ViewChild, AfterViewInit } from '@angular/core';
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
  @ViewChild('tree') tree;


  typeTitle = "Create";
  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }
  isActive :boolean= true;
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
    id:[""]
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
    if(this.dialogueData && this.dialogueData.type == "edit"){
      this.isActive = false;
      this.typeTitle = "Edit";

      console.log("dialogueData",this.dialogueData);
      let data = {
        permission_code: this.dialogueData.formData.PERMISSION_CODE,
        permission_desc: this.dialogueData.formData.PERMISSION_DESC,
        id: this.dialogueData.formData.ID,
      }
      try{
        const pA = JSON.parse(this.dialogueData.formData.PERMISSION_ARRAY);
        setTimeout(()=>{
          this.checkAll(pA);
          this.isActive = true;
        },100)
      }catch(e){}
      this.permissionForm.patchValue(data);
    }
    setTimeout(()=>{
      this.isActive = true;
    },100)
  }
  checkAll(array){
    console.log("datanode",this.treeControl.dataNodes)
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])){
        if(array.indexOf(this.treeControl.dataNodes[i].item) !== -1){
          this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
        }
      }
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }
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
  todoItemSelectionEdit(node: TodoItemFlatNode): void {
     this.checklistSelection.toggle(node);
     this.checklistSelection.select(node)

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
   if(this.dialogueData.type == "create"){
    if (this.permissionForm.valid) {
      let params = {
        ...this.permissionForm.value,
        permission_array: finalPermissionArr
      }
      if(!params.id){
        delete params.id
      }
      this.appService.createPermission(params).subscribe((res: any) => {
        this.permissionForm.reset();
        formDirective.resetForm();
        this.close();
        this.toastr.showSuccess("Permission saved successfully", "Success")
      });
    }
   }else if(this.dialogueData.type == "edit"){
    if (this.permissionForm.valid) {
      let params = {
        ...this.permissionForm.value,
        id:this.dialogueData.formData.ID,
        permission_array: finalPermissionArr
      }
      this.appService.editPermission(params).subscribe((res: any) => {
        this.permissionForm.reset();
        formDirective.resetForm();
        this.close();
        this.toastr.showSuccess("Permission saved successfully", "Success")
      });
    }
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
    "View Employees": "View Employees",
    "Create Employee": "Create Employee",
    "Edit Employee": "Edit Employee",
    "Delete Employee": "Delete Employee"
  },
  "User Management": {
    "View Users": "View Users",
    "Edit Users": "Edit Users",
    "Delete Users": "Delete Users"
  },
  "Admin Management": {
    "role_view": "View Role",
    "role_edit": "Edit Role",
    "role_create": "Create Role",
    "role_delete": "Delete Role",
    "permission_delete": "Delete Permission",
    "permission_create": "Create Permission",
    "permission_edit": "Edit Permission",
  },
};

