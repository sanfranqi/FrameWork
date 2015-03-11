package com.greenleaf.common.scheduler;

/**
 * @author QiSF 2015-03-11
 */
public interface SchedulerCallable extends Runnable {

	public abstract void close();
}
