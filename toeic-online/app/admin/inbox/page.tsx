import React from "react";

const InboxPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      {/* Main Content Container */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Inbox
        </h1>

        <p className="text-center text-gray-600 mb-6">
          View your latest messages and stay updated.
        </p>

        {/* Message Card */}
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full text-white flex items-center justify-center font-semibold text-base">
                  U
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-800">
                    User Name
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last message content...
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">5 minutes ago</div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full text-white flex items-center justify-center font-semibold text-base">
                  A
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-800">
                    Another User
                  </h3>
                  <p className="text-sm text-gray-500">
                    New message content...
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">2 hours ago</div>
            </div>
          </div>

          {/* Additional messages can go here */}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
