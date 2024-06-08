class Person {
    constructor(age, skill) {
        this.age = age;
        this.skill = skill;
    }
}

class MaxPriorityQueue {
    constructor() {
        this.queue = [];
    }

    compare(person1, person2) {
        if (person1.skill < person2.skill) return -1;
        if (person1.skill > person2.skill) return 1;
        return person1.age - person2.age;     }

    forAddToList(person) {
        this.queue.push(person);
        this._heapifyUp();
    }

    extractMax() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        const max = this.queue[0];
        const end = this.queue.pop();
        if (!this.isEmpty()) {
            this.queue[0] = end;
            this._heapifyDown();
        }
        return max;
    }

    isEmpty() {
        return this.queue.length === 0;
    }



    addPerson(age, skill) {
        const person = new Person(age, skill);
        this.forAddToList(person);
    }

    increaseSkill(age, skill, newSkill) {
        const index = this.queue.findIndex(
            (person) => person.age === age && person.skill === skill
        );
        if (index === -1) {
            throw new Error("Person not found in the queue");
        }

        this.queue[index].skill = newSkill;

        this._heapifyUp(index);
        this._heapifyDown(index);
    }

    _heapifyUp(index = this.queue.length - 1) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.queue[index], this.queue[parentIndex]) <= 0)
                break;
            [this.queue[index], this.queue[parentIndex]] = [
                this.queue[parentIndex],
                this.queue[index],
            ];
            index = parentIndex;
        }
    }

    _heapifyDown(index = 0) {
        const length = this.queue.length;
        const element = this.queue[index];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.queue[leftChildIndex];
                if (this.compare(leftChild, element) > 0) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.queue[rightChildIndex];
                if (
                    (swap === null && this.compare(rightChild, element) > 0) ||
                    (swap !== null && this.compare(rightChild, leftChild) > 0)
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            [this.queue[index], this.queue[swap]] = [
                this.queue[swap],
                this.queue[index],
            ];
            index = swap;
        }
    }
}

const pq = new MaxPriorityQueue();

function addPerson() {
    const age = document.getElementById("age").value;
    const skill = document.getElementById("skill").value;
    pq.addPerson(Number(age), skill);
    alert("فرد جدید اضافه شد!");
    showQueue();
}

function extractMax() {
    try {
        const person = pq.extractMax();
        document.getElementById(
            "max-person"
        ).innerText = ` فرد برتر: سن - ${person.age}, توانایی - ${person.skill}`;
        showQueue();
    } catch (error) {
        alert(error.message);
    }
}

function increaseSkill() {
    const age = document.getElementById("update-age").value;
    const skill = document.getElementById("update-skill").value;
    const newSkill = document.getElementById("new-skill").value;
    try {
        pq.increaseSkill(Number(age), skill, newSkill);
        alert("سطح فرد افزایش یافت!");
        showQueue();
    } catch (error) {
        alert(error.message);
    }
}

function showQueue() {
    const queueList = document.getElementById("queue-list");
    queueList.innerHTML = "";
    pq.queue.forEach((person) => {
        const li = document.createElement("li");
        li.innerText = `سن: ${person.age}, توانایی: ${person.skill}`;
        queueList.appendChild(li);
    });
}
