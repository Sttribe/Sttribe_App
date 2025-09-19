// Recharge API integration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, number, amount, operator, plan } = body;

    // Simulate recharge API call
    const rechargeData = {
      transaction_id: `TXN${Date.now()}`,
      type,
      number,
      amount,
      operator,
      plan,
      status: 'success',
      timestamp: new Date().toISOString(),
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Random success/failure for demo
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      return Response.json({
        success: true,
        message: 'Recharge successful',
        data: rechargeData,
      });
    } else {
      return Response.json(
        { 
          success: false, 
          error: 'Recharge failed. Please try again.',
          transaction_id: rechargeData.transaction_id 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get recharge history
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Mock recharge history
    const history = [
      {
        id: 1,
        transaction_id: 'TXN1704067200000',
        type: 'Mobile',
        number: '9876543210',
        amount: 399,
        operator: 'Airtel',
        status: 'success',
        timestamp: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        transaction_id: 'TXN1703980800000',
        type: 'DTH',
        number: '1234567890',
        amount: 299,
        operator: 'Tata Sky',
        status: 'success',
        timestamp: '2023-12-30T15:30:00Z',
      },
    ];

    return Response.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}