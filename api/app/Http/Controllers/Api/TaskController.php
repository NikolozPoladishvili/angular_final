<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($task, 201);
    }

    public function show(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->all());

        return response()->json($task);
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function statistics(Request $request)
    {
        $tasks = Task::where('user_id', $request->user()->id)->get();

        return response()->json([
            'total' => $tasks->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
        ]);
    }
}
