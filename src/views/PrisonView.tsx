import React from "react";
import BaseView from "./BaseView";

const PrisonView = () => {
  return (
    <BaseView title="Prison">
      <div className="cyber-border p-4">
        <h3 className="text-xl font-semibold mb-4">Your Status</h3>
        <div className="space-y-4">
          <div className="p-4 bg-cyber-dark-medium rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
                <div>
                  <h4 className="font-medium text-cyber-blue">Sentence</h4>
                  <p className="text-sm text-gray-400">Not in prison</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyber-green">Free</p>
                <p className="text-sm text-gray-400">Current status</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cyber-dark-medium rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <h4 className="font-medium text-cyber-blue">Gang Members</h4>
                  <p className="text-sm text-gray-400">2 members in prison</p>
                </div>
              </div>
              <button className="bg-cyber-blue text-white px-4 py-2 rounded hover:bg-cyber-blue/80 transition-colors">
                View Members
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-border p-4">
        <h3 className="text-xl font-semibold mb-4">Prison Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example activity - will be replaced with real data */}
          <div className="p-4 bg-cyber-dark-medium rounded">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-cyber-blue">Workout</h4>
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-sm">
                    <span>Strength:</span>
                    <span className="text-cyber-green">+1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span>1 hour</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-cyber-blue text-white py-2 rounded hover:bg-cyber-blue/80 transition-colors">
              Start Workout
            </button>
          </div>

          <div className="p-4 bg-cyber-dark-medium rounded">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-cyber-blue">Study</h4>
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-sm">
                    <span>Intelligence:</span>
                    <span className="text-cyber-green">+1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span>1 hour</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-cyber-blue text-white py-2 rounded hover:bg-cyber-blue/80 transition-colors">
              Start Studying
            </button>
          </div>
        </div>
      </div>
    </BaseView>
  );
};

export default PrisonView;
