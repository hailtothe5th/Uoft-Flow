import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function DebugDatabase() {
  const { user, isAuthenticated } = useAuth();
  const { refreshData } = useData();
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testConnection = async () => {
    setTesting(true);
    setLogs([]);
    
    addLog('🔍 Starting database connection test...');
    
    // Test 1: Check authentication
    addLog('🔐 Checking authentication...');
    addLog(`User: ${user?.email || 'Not logged in'}`);
    addLog(`Is Authenticated: ${isAuthenticated}`);
    
    const sessionResponse = await supabase.auth.getSession();
    const session = sessionResponse?.data?.session ?? null;
    addLog(`Supabase Session: ${session ? 'Active' : 'None'}`);
    addLog(`Supabase User ID: ${session?.user?.id || 'None'}`);
    
    // Test 2: Check if tables exist
    addLog('\n📊 Checking if tables exist...');
    
    try {
      const facilitiesResult = await supabase
        .from('facilities')
        .select('id')
        .limit(1);
      
      if (facilitiesResult.error) {
        addLog(`❌ Facilities table error: ${facilitiesResult.error.message}`);
      } else {
        addLog(`✅ Facilities table exists`);
      }
    } catch (error: any) {
      addLog(`❌ Facilities check failed: ${error.message}`);
    }
    
    try {
      const reviewsResult = await supabase
        .from('reviews')
        .select('id')
        .limit(1);
      
      if (reviewsResult.error) {
        addLog(`❌ Reviews table error: ${reviewsResult.error.message}`);
      } else {
        addLog(`✅ Reviews table exists`);
      }
    } catch (error: any) {
      addLog(`❌ Reviews check failed: ${error.message}`);
    }
    
    // Test 3: Try to insert a test review
    addLog('\n💾 Testing review insertion...');
    
    if (!session?.user) {
      addLog('❌ Cannot test insertion - no active session');
      setTesting(false);
      return;
    }
    
    try {
      const testReview = {
        id: `test-${Date.now()}`,
        facility_id: 'robarts-m-1',
        user_id: session.user.id,
        user_name: user?.displayName || 'Test User',
        overall_rating: 5,
        cleanliness_rating: 5,
        condition: 'Excellent',
        comment: 'Test review from debug page',
        created_at: new Date().toISOString(),
      };
      
      addLog('Attempting to insert test review...');
      addLog(`Review ID: ${testReview.id}`);
      addLog(`User ID: ${testReview.user_id}`);
      addLog(`Facility ID: ${testReview.facility_id}`);
      
      const { data, error } = await supabase
        .from('reviews')
        .insert(testReview)
        .select();
      
      if (error) {
        addLog(`❌ Insert failed: ${error.message}`);
        addLog(`Error code: ${error.code}`);
        addLog(`Error details: ${error.details || 'None'}`);
        addLog(`Error hint: ${error.hint || 'None'}`);
      } else {
        addLog(`✅ Insert successful!`);
        addLog(`Inserted review: ${JSON.stringify(data)}`);
        
        // Clean up test review
        addLog('Cleaning up test review...');
        const { error: deleteError } = await supabase
          .from('reviews')
          .delete()
          .eq('id', testReview.id);
        
        if (deleteError) {
          addLog(`⚠️ Cleanup failed: ${deleteError.message}`);
        } else {
          addLog(`✅ Test review deleted`);
        }
      }
    } catch (error: any) {
      addLog(`❌ Insert test failed: ${error.message}`);
      addLog(`Stack: ${error.stack}`);
    }
    
    // Test 4: Check RLS policies
    addLog('\n🔒 Checking RLS policies...');
    try {
      const policiesResult = await supabase
        .from('pg_policies')
        .select('*')
        .eq('schemaname', 'public');
      
      if (policiesResult.error) {
        addLog(`⚠️ Could not check policies: ${policiesResult.error.message}`);
      } else {
        const policies = policiesResult.data;
        addLog(`Found ${policies?.length || 0} policies`);
        policies?.forEach((policy: any) => {
          addLog(`  - ${policy.tablename}: ${policy.policyname} (${policy.cmd})`);
        });
      }
    } catch (error: any) {
      addLog(`⚠️ Policy check failed: ${error.message}`);
    }
    
    addLog('\n✅ Test complete!');
    setTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Database Debug Tool</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={testConnection}
            disabled={testing}
            className="px-6 py-3 bg-uoft-blue text-white rounded-lg font-semibold hover:bg-uoft-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Run Database Test'}
          </button>
          
          <button
            onClick={async () => {
              setRefreshing(true);
              addLog('🔄 Forcing data refresh from Supabase...');
              await refreshData();
              addLog('✅ Data refresh complete! Check console for details.');
              setRefreshing(false);
            }}
            disabled={refreshing}
            className="px-6 py-3 bg-amber-accent text-uoft-blue-dark rounded-lg font-semibold hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? 'Refreshing...' : '🔄 Force Refresh Data'}
          </button>
        </div>
        
        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
          💡 What to Check
        </h2>
        <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
          <li>If tables don't exist, run the SQL schema in Supabase</li>
          <li>If RLS policies are missing, check the schema includes policy creation</li>
          <li>If insert fails with permission error, check RLS policies allow authenticated users</li>
          <li>If no session, sign out and sign in again</li>
          <li>Check browser console (F12) for detailed error messages</li>
        </ul>
      </div>
    </div>
  );
}
