// A binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.
// Left child is always less than it's parent and the right child is always bigger than it's parent.

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.right = null;
        this.left = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    //inserts a number into the tree. Returns the entire tree.
    insert(key, value) {
        const newNode = new Node(key, value);
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        let current = this.root;
        const rnLoop = true;
        while (rnLoop) {
            if (key === current.key) return undefined;
            if (key < current.key) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }
    //finds the given number and returns it. If its not found, returns `null` or `undefined`.
    find(key) {
        if (!this.root) return null;
        let current = this.root;
        const rnLoop = true;
        while (rnLoop) {
            if (!current) return undefined;
            if (key === current.value) return current;
            if (key < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
    }
    //checks if a given number exists in the tree. If its in the tree, returns `true`, otherwise `false`
    contains(key) {
        if (!this.root) return null;
        let current = this.root;
        const rnLoop = true;
        while (rnLoop) {
            if (!current) return false;
            if (key === current.value) return true;
            if (key < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
    }
}