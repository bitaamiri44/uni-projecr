class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    findNext(node, value) {
        let current = this.findNode(node, value);
        if (!current) {
            return null;
        }

        if (current.right) {
            current = current.right;
            while (current.left) {
                current = current.left;
            }
            return current.value;
        } else {
            let successor = null;
            let ancestor = node;
            while (ancestor !== current) {
                if (current.value < ancestor.value) {
                    successor = ancestor.value;
                    ancestor = ancestor.left;
                } else {
                    ancestor = ancestor.right;
                }
            }
            return successor;
        }
    }
    findNode(node, value) {
        if (!node) {
            return null;
        }

        if (value < node.value) {
            return this.findNode(node.left, value);
        } else if (value > node.value) {
            return this.findNode(node.right, value);
        } else {
            return node;
        }
    }

    findPrev(node, value) {
        let current = this.findNode(node, value);
        if (!current) {
            return null;
        }

        if (current.left) {
            current = current.left;
            while (current.right) {
                current = current.right;
            }
            return current.value;
        } else {
            let predecessor = null;
            let ancestor = node;
            while (ancestor !== current) {
                if (current.value > ancestor.value) {
                    predecessor = ancestor.value;
                    ancestor = ancestor.right;
                } else {
                    ancestor = ancestor.left;
                }
            }
            return predecessor;
        }
    }
    remove(value) {
        this.root = this.removeNode(this.root, value);
    }
    findMinNode(node) { while (node && node.left !== null) { node = node.left; } return node; }

    removeNode(node, value) {
        if (!node) {
            return null;
        }

        if (value < node.value) {
            node.left = this.removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this.removeNode(node.right, value);
            return node;
        } else {
            if (!node.left && !node.right) {
                node = null;
                return node;
            }

            if (!node.left) {
                node = node.right;
                return node;
            } else if (!node.right) {
                node = node.left;
                return node;
            }

            const minRight = this.findMinNode(node.right);
            node.value = minRight.value;
            node.right = this.removeNode(node.right, minRight.value);
            return node;
        }
    }

    mergeWith(otherTree) {
        this.mergeTrees(this.root, otherTree.root);
    }

    mergeTrees(node1, node2) {
        if (node2 !== null) {
            this.insert(node2.value);
            this.mergeTrees(node1, node2.left);
            this.mergeTrees(node1, node2.right);
        }
    }
    inOrderTraverse(node, callback) {
        if (node !== null) {
            this.inOrderTraverse(node.left, callback);
            callback(node);
            this.inOrderTraverse(node.right, callback);
        }
    }
    findKMaxValues(k) {
        const maxHeap = new MaxHeap();
        this.reverseInOrder(this.root, maxHeap, k);
        return maxHeap.heap;
    }

    reverseInOrder(node, maxHeap, k) {
        if (node !== null && maxHeap.heap.length < k) {
            this.reverseInOrder(node.right, maxHeap, k);
            if (maxHeap.heap.length < k) {
                maxHeap.insert(node.value);
                this.reverseInOrder(node.left, maxHeap, k);
            }
        }
    }
}
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    insert(value) {
        this.heap.push(value);
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let element = this.heap[index];
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];
            if (parent >= element) break;
            this.heap[index] = parent;
            this.heap[parentIndex] = element;
            index = parentIndex;
        }
    }

    extractMax() {
        const max = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return max;
    }

    sinkDown(index) {
        let left, right, largest, length;
        length = this.heap.length;
        while (true) {
            left = 2 * index + 1;
            right = 2 * index + 2;
            largest = index;
            if (left < length && this.heap[left] > this.heap[largest]) {
                largest = left;
            }
            if (right < length && this.heap[right] > this.heap[largest]) {
                largest = right;
            }
            if (largest === index) break;
            [this.heap[index], this.heap[largest]] = [
                this.heap[largest],
                this.heap[index],
            ];
            index = largest;
        }
    }
}
const bst = new BST();
bst.insert(9);
bst.insert(3);
bst.insert(12);
bst.insert(27);
bst.insert(2);
bst.insert(11);

console.log("BST بعد از درج: ");
bst.inOrderTraverse(bst.root, (node) => console.log(node.value));


console.log("بعدی 11:", bst.findNext(bst.root, 11)); 
console.log("قبلی 11:", bst.findPrev(bst.root, 11));


bst.remove(11);
console.log("BST بعد از حذف 11: ");
bst.inOrderTraverse(bst.root, (node) => console.log(node.value));


const bst2 = new BST();
bst2.insert(25);
bst2.insert(12);
bst.mergeWith(bst2);
console.log("BST بعد از ادغام: ");
bst.inOrderTraverse(bst.root, (node) => console.log(node.value));

const k = 3;
const maxValues = bst.findKMaxValues(k);
console.log(`بیشینه‌های ${k} تایی: `, maxValues);
