import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fetchBankAccounts, BankAccount, patchBankAccountVerification } from '../../api/bankAccounts';
const AllTransactions = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<BankAccount | null>(null);
  const [imageUrlToView, setImageUrlToView] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<number | null>(null);
  const [verifyReason, setVerifyReason] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const formatError = (e: any) => {
    const d = e?.detail ?? e;
    if (d == null) return String(e ?? 'Unknown error');
    if (typeof d === 'string') return d;
    try {
      return JSON.stringify(d);
    } catch (_) {
      return String(d);
    }
  };
  // When a modal is opened, initialise the verification controls from selected
  React.useEffect(() => {
    if (selected) {
      // map string statuses to numeric codes (1=Verified,2=Rejected)
      const s = selected.is_verified;
      let code: number | null = null;
      if (typeof s === 'number') {
        if (s === 1) code = 1;
        else if (s === 2) code = 2;
      } else if (typeof s === 'string') {
        if (s.toLowerCase().includes('verif')) code = 1;
        else if (s.toLowerCase().includes('reject')) code = 2;
      }
      setVerifyStatus(code);
      setVerifyReason(selected.reason ?? '');
    } else {
      setVerifyStatus(null);
      setVerifyReason('');
      setUpdateError(null);
    }
  }, [selected]);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBankAccounts()
      .then(res => {
        if (!mounted) return;
        setAccounts(res.bank_accounts || []);
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError(formatError(err));
        setLoading(false);
      });
    return () => { mounted = false };
  }, []);
  return (
    <div>
      <h1 className='text-3xl dark:text-white font-extrabold dark:bg-gray-800 '>Bank Accounts</h1>
      <div className='overflow-x-auto mt-6'>
        <table className='w-full border-collapse mt-4'>
          <thead className='bg-purple-50 text-gray-700'>
            <tr>
              <th className='py-3 px-3 text-left'>Bank ID</th>
              <th className='py-3 px-3 text-left'>User ID</th>
              <th className='py-3 px-3 text-left'>User Name</th>
              <th className='py-3 px-3 text-left'>User Email</th>
              <th className='py-3 px-3 text-left'>Bank Name</th>
              <th className='py-3 px-3 text-left'>Branch Name</th>
              <th className='py-3 px-3 text-left'>Account Type</th>
              <th className='py-3 px-3 text-left'>Account Holder</th>
              <th className='py-3 px-3 text-left'>Account Number</th>
              <th className='py-3 px-3 text-left'>IFSC</th>
              <th className='py-3 px-3 text-left'>Passbook</th>
              <th className='py-3 px-3 text-left'>Verified</th>
              <th className='py-3 px-3 text-left'>Reason</th>
              <th className='py-3 px-3 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={14} className='py-5 px-4'>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={14} className='py-5 px-4 text-red-600'>Error: {error}</td></tr>
            ) : accounts.length === 0 ? (
              <tr><td colSpan={14} className='py-5 px-4'>No bank accounts found</td></tr>
            ) : (
              accounts.map((a, i) => (
                <tr key={a.bank_id} className='border-t hover:bg-gray-50 dark:hover:bg-gray-900'>
                  <td className='py-3 px-3 dark:text-white'>{a.bank_id}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.user_id}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.user_name}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.user_email}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.bank_name}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.branch_name}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.account_type}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.account_holder_name}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.account_number}</td>
                  <td className='py-3 px-3 dark:text-white'>{a.ifsc_code}</td>
                  <td className='py-3 px-3 dark:text-white'>
                    {a.passbook_photo ? (
                      <img
                        src={a.passbook_photo}
                        alt='passbook'
                        className='w-20 h-12 object-cover rounded cursor-pointer'
                        onClick={() => setImageUrlToView(a.passbook_photo)}
                      />
                    ) : <span className='text-gray-500'>-</span>}
                  </td>
                  <td className='py-3 px-3 dark:text-white'>
                    {/** show readable status */}
                    {(() => {
                      const label = typeof a.is_verified === 'number'
                        ? (a.is_verified === 1 ? 'Verified' : a.is_verified === 2 ? 'Rejected' : 'Pending')
                        : (a.is_verified ?? 'Pending');
                      const cls = label === 'Verified' ? 'bg-green-100 text-green-800' : label === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                      return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{label}</span>;
                    })()}
                  </td>
                  <td className='py-3 px-3 dark:text-white'>{a.reason ?? '-'}</td>
                  <td className='py-3 px-3 text-purple-600 cursor-pointer'>
                    <Eye onClick={() => setSelected(a)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className='fixed inset-0 bg-blue/50 bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white w-[700px] rounded-lg shadow-lg p-6 relative'>
            <button onClick={() => setSelected(null)} className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl'>×</button>
            <h2 className='text-xl font-bold mb-4'>Bank Account Details</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-sm text-gray-600'>Bank ID</div>
                <div className='font-semibold'>{selected.bank_id}</div>

                <div className='text-sm text-gray-600 mt-2'>User</div>
                <div className='font-semibold'>{selected.user_name} ({selected.user_email})</div>

                <div className='text-sm text-gray-600 mt-2'>Account Holder</div>
                <div className='font-semibold'>{selected.account_holder_name}</div>

                <div className='text-sm text-gray-600 mt-2'>Account Number</div>
                <div className='font-semibold'>{selected.account_number}</div>

                <div className='text-sm text-gray-600 mt-2'>IFSC</div>
                <div className='font-semibold'>{selected.ifsc_code}</div>

                <div className='text-sm text-gray-600 mt-2'>Verified</div>
                <div className='font-semibold'>{selected.is_verified}</div>

                <div className='text-sm text-gray-600 mt-2'>Reason</div>
                <div className='font-semibold'>{selected.reason ?? '-'}</div>
                
                {/* Verification controls (only Verified / Rejected) */}
                <div className='text-sm text-gray-600 mt-4'>Update Verification</div>
                <div className='mt-2 flex flex-col gap-2'>
                  <div className='flex gap-2'>
                    <button type='button' onClick={() => setVerifyStatus(1)} className={`px-3 py-1 rounded border ${verifyStatus === 1 ? 'bg-green-600 text-white' : ''}`}>Verified</button>
                    <button type='button' onClick={() => setVerifyStatus(2)} className={`px-3 py-1 rounded border ${verifyStatus === 2 ? 'bg-red-600 text-white' : ''}`}>Rejected</button>
                  </div>
                  {verifyStatus === 2 && (
                    <input type='text' placeholder='Reason (required when rejecting)' value={verifyReason} onChange={(e) => setVerifyReason(e.target.value)} className='border rounded px-2 py-1' />
                  )}
                  <div className='flex justify-end'>
                    <button disabled={updateLoading} onClick={async () => {
                      setUpdateError(null);
                      // Validation: if rejecting, reason required
                      // Require explicit selection of Verified (1) or Rejected (2)
                      if (verifyStatus !== 1 && verifyStatus !== 2) {
                        setUpdateError('Select Verified or Rejected');
                        return;
                      }
                      // If rejecting, reason is required
                      if (verifyStatus === 2 && verifyReason.trim() === '') {
                        setUpdateError('Reason is required when rejecting');
                        return;
                      }
                      try {
                        setUpdateLoading(true);
                        const payload = verifyStatus === 2 ? { is_verified: verifyStatus, reason: verifyReason } : { is_verified: verifyStatus };
                        const resp = await patchBankAccountVerification(selected.bank_id, payload);
                        // update accounts state
                        setAccounts(prev => prev.map(p => (String(p.bank_id) === String(resp.bank_id) ? { ...p, is_verified: resp.is_verified, reason: resp.reason } : p)));
                        // update selected
                        setSelected(prev => prev ? { ...prev, is_verified: resp.is_verified, reason: resp.reason } : prev);
                      } catch (err: any) {
                        setUpdateError(formatError(err));
                      } finally {
                        setUpdateLoading(false);
                      }
                    }} className='bg-sky-600 text-white px-3 py-1 rounded'>{updateLoading ? 'Updating...' : 'Update'}</button>
                  </div>
                  {updateError && <div className='text-sm text-red-600 mt-2'>{updateError}</div>}
                </div>
              </div>

              <div>
                <div className='text-sm text-gray-600'>Bank Name</div>
                <div className='font-semibold'>{selected.bank_name}</div>

                <div className='text-sm text-gray-600 mt-2'>Branch</div>
                <div className='font-semibold'>{selected.branch_name}</div>

                <div className='text-sm text-gray-600 mt-4'>Passbook Photo</div>
                {selected.passbook_photo ? (
                  <>
                    <img
                      src={selected.passbook_photo}
                      alt='passbook'
                      className='w-full h-64 object-contain rounded mt-2 cursor-pointer'
                      onClick={() => setImageUrlToView(selected.passbook_photo!)}
                    />
                    <div className='mt-2 flex gap-2'>
                      {/* <a href={selected.passbook_photo} target='_blank' rel='noreferrer' className='text-sm text-blue-600 underline'>Open in new tab</a> */}
                      {/* <a href={selected.passbook_photo} download className='text-sm text-blue-600 underline'>Download</a> */}
                    </div>
                  </>
                ) : (
                  <div className='text-gray-500'>No passbook photo</div>
                )}
              </div>
            </div>

            <div className='mt-6 text-right'>
              <button onClick={() => setSelected(null)} className='bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded'>Close</button>
            </div>
          </div>
        </div>
      )}

        {/* Full-size image viewer modal */}
        {imageUrlToView && (
          <div className='fixed inset-0 bg-blue/80 flex items-center justify-center z-60' onClick={() => setImageUrlToView(null)}>
            <div className='relative max-w-[95%] max-h-[95%]' onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setImageUrlToView(null)} className='absolute top-2 right-2 z-50 text-white bg-blue/40 rounded-full p-2'>×</button>
              <img src={imageUrlToView} alt='full-passbook' className='w-full h-auto max-h-[90vh] object-contain rounded' />
              <div className='mt-2 flex justify-center gap-4'>
                <a href={imageUrlToView} target='_blank' rel='noreferrer' className='text-sm text-white underline bg-blue/30 px-3 py-1 rounded'>Open in new tab</a>
                {/* <a href={imageUrlToView} download className='text-sm text-white underline bg-blue/30 px-3 py-1 rounded'>Download</a> */}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AllTransactions;
