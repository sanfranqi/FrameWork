package com.greenleaf.common.scheduler;

/**
 * Created by Administrator on 14-3-7.
 */
public interface SchedulerCallable extends Runnable {

    public abstract void close();
}
