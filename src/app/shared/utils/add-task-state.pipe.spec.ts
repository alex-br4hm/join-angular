import { AddTaskStatePipe } from './add-task-state.pipe';

describe('AddTaskStatePipe', () => {
  it('create an instance', () => {
    const pipe = new AddTaskStatePipe();
    expect(pipe).toBeTruthy();
  });
});
